from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "accounts" DROP COLUMN "plan";
        ALTER TABLE "accounts" DROP COLUMN "company";"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "accounts" ADD "plan" VARCHAR(10) NOT NULL DEFAULT 'free';
        ALTER TABLE "accounts" ADD "company" VARCHAR(100);
        COMMENT ON COLUMN "accounts"."plan" IS 'FREE: free\nBASIC: basic\nPRO: pro\nENTERPRISE: enterprise';"""


MODELS_STATE = (
    "eJztm21v0zoUgP9KlE9caXdivduACSGlXQaBrkFrgXthKHITtzVL7JI4KwXtv1/beX/rmp"
    "Kuq8inLefFdh6f2D4n6S/ZIRa0vUPFNImPqXwm/ZIxcCD7J686kGQwnycKLqBgbAtbEBgJ"
    "IRh71AUmb2wCbA8ykQU900VzighmUuzbNhcSkxkiPE1EPkbffWhQMoV0Bl2m+PKViRG24A"
    "/oRZfzG2OCoG1lRoss3reQG3Q5F7LeDLgXwpJ3NzZMYvsOTqznSzojODZno+HSKcTQBRRa"
    "qRvg4wvvNRIFY2UC6vowHqSVCCw4Ab7NMcgvJz42+d1LIVRjDDx4+NIGztgCr17JNRiZBH"
    "O+iNPmABzww7AhntIZu+yc3gW3moAIrPgoPipXvTfK1ZPO6V+8Q8ImKZi9QajpCNWdaAJQ"
    "EDQisCecTRdyNgagRd7nTEORA8uZZz1z7K3Q9TD6Z5OZiATJVCQBGM1FBHZD2uweLB3by3"
    "CaV9AeaZfqcKRcvud34njed1sgUkYq13SEdJmTPsnPTNyI9EkbvZH4pfRZH6iCIPHo1BU9"
    "JnajzzIfE/ApMTBZGMBKRWQkjcAwy2Ri/bm14cRmPduJ3enEhoNP5pWtN3Czec16NjCv4W"
    "gfcFr3ZBqj2175gIq/Nfa4yL6ZXe4BHsHMTnb09OkaWxmzqtzLhO4ugxA6ANl1GMYOD3VU"
    "aBJh5+RkndPAyUn1cYDrsgjnwPMWxK112kr77Gc0NoaSn18nN6mTFReMgXmzAK5lZDQp5i"
    "75Bs3gdJ1l3g09L95dQRuIeywyDs+c74NWHifuuyhmImm0lXE+pEOqiBVVTsfJSwAGUzFq"
    "3jfvKUekJOtJwarOetLz0mY9bdbTZj2P6lTVZj1/zMS2WU+b9bRZT0XWEx5TDA+yzajkeV"
    "hxcC947mMedHq8BtPT40qkXJUlOkMeJe7SgJjfYckZrEuIDQEup1rincM6Zu7bCtcYddNL"
    "S1fX+5lVpauNckg/XHZVFr6CNDNCVIi1wSjHl60IswBGabCq2HcEWo2NDWATFhBnGni4pU"
    "DGBMPisVYesMWREWXKa/z+Q7evDd9og9eGPuj/dybN/bGNvBmjbhC2FV9jpd8/k4AtIqD2"
    "ArJOnnpUnaYeFRL+8NWOUS/VyHrt52LcTFpRyPgLaItcL4gL0RS/g8tCmJfn9qmXdI+Pal"
    "Vuz8QuWMRZbS5m2E0GRzERaMqwp5yr8t065RKW7ttLisxm6iVKurX9gfsQhZMETXUFJYPv"
    "3lKKkZm7e2sq8pChsaEUewWVBmlCXL6ASmGrEryFDJe0QHQmTZBNIUcqmWAOxojtQgh6+b"
    "W22Zbvr/B8iQkE0Z8qGzDLvFb0avAcpForonm1b3w1I75bbbuA8KZa6xDMVsv4cglB2FRZ"
    "R8mg8h1H1kuDTMIe26pXW/VqiyNt1aud2Lbq9YdVvVK7ZelOd38GnG1hxwmYzIgMldeqMV"
    "QHozPJgZ7HDpaGx4Z4jSPdldpTtY/qeaJ3oQnRLbSucfdKV85ZEjAKWxi7BFgm8GjYRqJP"
    "WklsknbONaaPGrGQGxS3eAuhJnEPtYlvr68xN6OnDwbMkpuYNuKQWRxiZpqyOdeGRTMLeS"
    "nLK12/NN7q2oBbuIQ4xjeCcKzpqxejUG7DCd2oFPBinVLAi+pSwIt8KSAcPooiacPQLGlm"
    "o/hsbImRP6ndod57pzLkCzj2iHkDWUgMh+qZ5HlwE/jrsK9GXyAvAqHesTflslu6u/7kIh"
    "PBwaNYj2TGqWUZ5/nRKo5+liwFGqblNPNuOaBorSrWDoBOeT9/d46Onx0//+f0+DkzEUOJ"
    "Jc9WIC6WuOPsGBTZvR3qg4rv0TJeOXQfMLunLxYy6YFkI49+3VqZO8lxxz6yKcLeIe/2d3"
    "LbFfA4jszBLQrLJ5fKv/mI7fX1bv5ExhvoVvEviV1+VL6Hf1noZo7JD8B+QDA8pMQCyy2B"
    "50fhUmyibLP+I5912uiB/11WYS0mLuc1U4/Z0pqQ1MDqMs75tqhXo96IcQt3PbhxYbgW3d"
    "irxbsaryi016UbObVwq+BmX3HU/VCmfd294nX3PPmm+jdfd+/lp+wHudfd2Zip+7p7m693"
    "FegicyaX/Rg40Bys/C1wYvNovomvXBZLH9iS5TCcwJ1+1NbISlf9tu8Wul74QcS6y17KZU"
    "/XvG0URvijUQNiaL6fALfywSrrkcKy76KqCyMpl11VRbb29qqx+keNH581v73c/Q+ppnWo"
)
