from typing import cast
import os
import httpx
from nexios import status
from nexios.http import Request, Response
from nexios.routing import Router
from nexios.auth.decorator import auth
from models.accounts import Account
from models.subscriptions import Subscription

router = Router(prefix="/payments", tags=["payments"])

PAYSTACK_SECRET = os.getenv("PAYSTACK_SECRET")
PAYSTACK_BASE = "https://api.paystack.co"

PLANS = {
    "starter": {"name": "Starter", "amount": 0, "price_label": "$0", "description": "Free tier"},
    "pro": {"name": "Pro", "amount": 2900000, "price_label": "$29", "description": "For growing teams"},
    "enterprise": {"name": "Enterprise", "amount": 0, "price_label": "Custom", "description": "For organizations"},
}


@router.get("/plans")
async def get_plans(request: Request, response: Response):
    return {"plans": [{"id": key, **plan} for key, plan in PLANS.items()]}


@router.post("/initialize")
@auth()
async def initialize_payment(request: Request, response: Response):
    user = cast(Account, request.user)
    if not user.is_authenticated:
        return response.json({"detail": "Authentication required"}, status_code=status.HTTP_401_UNAUTHORIZED)

    data = await request.json
    plan_type = data.get("plan_type")

    if plan_type not in PLANS:
        return response.json({"detail": f"Invalid plan: {plan_type}"}, status_code=status.HTTP_400_BAD_REQUEST)

    plan = PLANS[plan_type]
    amount = plan["amount"]

    if amount <= 0:
        return response.json({"detail": "This plan is free. No payment required."}, status_code=status.HTTP_400_BAD_REQUEST)

    if not PAYSTACK_SECRET:
        return response.json({"detail": "Paystack not configured on the server."}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    callback_url = data.get("callback_url")
    paystack_payload = {
        "email": user.email,
        "amount": amount,
        "metadata": {
            "plan_type": plan_type,
            "account_id": str(user.id),
        },
    }
    if callback_url:
        paystack_payload["callback_url"] = callback_url

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{PAYSTACK_BASE}/transaction/initialize",
            json=paystack_payload,
            headers={"Authorization": f"Bearer {PAYSTACK_SECRET}", "Content-Type": "application/json"},
        )

        data = resp.json()

        if not data.get("status"):
            return response.json(
                {"detail": "Payment initialization failed", "paystack_message": data.get("message")},
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        paystack_data = data["data"]

        await Subscription.create(
            account=user,
            plan_type=plan_type,
            status="pending",
            paystack_reference=paystack_data["reference"],
            amount=amount,
        )

        return {
            "access_code": paystack_data["access_code"],
            "reference": paystack_data["reference"],
            "authorization_url": paystack_data["authorization_url"],
        }


@router.get("/verify")
@auth()
async def verify_payment(request: Request, response: Response):
    user = cast(Account, request.user)
    if not user.is_authenticated:
        return response.json({"detail": "Authentication required"}, status_code=status.HTTP_401_UNAUTHORIZED)

    reference = request.query_params.get("reference")
    if not reference:
        return response.json({"detail": "Missing reference parameter"}, status_code=status.HTTP_400_BAD_REQUEST)

    if not PAYSTACK_SECRET:
        return response.json({"detail": "Paystack not configured on the server."}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{PAYSTACK_BASE}/transaction/verify/{reference}",
            headers={"Authorization": f"Bearer {PAYSTACK_SECRET}"},
        )

        data = resp.json()

        if not data.get("status"):
            return response.json(
                {"detail": "Verification failed", "paystack_message": data.get("message")},
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        paystack_data = data["data"]

        if paystack_data["status"] != "success":
            return response.json(
                {"detail": "Payment was not successful", "status": paystack_data["status"]},
                status_code=status.HTTP_400_BAD_REQUEST,
            )

    sub = await Subscription.get_or_none(paystack_reference=reference, account=user)
    if not sub:
        return response.json({"detail": "Subscription record not found"}, status_code=status.HTTP_404_NOT_FOUND)

    sub.status = "active"
    await sub.save()

    return {
        "status": "success",
        "plan_type": sub.plan_type,
        "message": f"{sub.plan_type.title()} plan activated successfully",
    }


@router.get("/subscription")
@auth()
async def get_subscription(request: Request, response: Response):
    user = cast(Account, request.user)
    if not user.is_authenticated:
        return response.json({"detail": "Authentication required"}, status_code=status.HTTP_401_UNAUTHORIZED)

    sub = await Subscription.filter(account=user, status="active").order_by("-created_at").first()

    if not sub:
        return {"subscription": None, "plan": "starter"}

    return {
        "subscription": {
            "id": str(sub.id),
            "plan_type": sub.plan_type,
            "status": sub.status,
            "start_date": sub.start_date.isoformat() if sub.start_date else None,
            "end_date": sub.end_date.isoformat() if sub.end_date else None,
        },
        "plan": sub.plan_type,
    }
