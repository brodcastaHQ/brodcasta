
const Loading = ({ size = 'md', fullScreen = false }) => {
    const loadingContent = (
        <div className="flex flex-col items-center justify-center gap-4">
            <span className={`loading loading-spinner text-primary loading-${size}`}></span>
            <span className="text-base-content/60 font-medium animate-pulse">Loading...</span>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-100/80 backdrop-blur-md">
                {loadingContent}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-4">
            {loadingContent}
        </div>
    );
};

export default Loading;
