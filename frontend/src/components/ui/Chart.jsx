import React from 'react';

const Chart = ({ type, data, labels, height = 200 }) => {
    if (type === 'bar') {
        const maxValue = Math.max(...data);
        
        return (
            <div className="h-64 flex items-end justify-between gap-1">
                {data.map((value, index) => {
                    const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
                    return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                            <div 
                                className="w-full bg-primary rounded-t transition-all duration-300 hover:bg-primary/80"
                                style={{ height: `${height}%` }}
                                title={`${labels[index]}: ${value}`}
                            ></div>
                            <span className="text-xs text-base-content/60 mt-1 truncate">
                                {labels[index]}
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    }
    
    if (type === 'line') {
        const maxValue = Math.max(...data);
        const points = data.map((value, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = maxValue > 0 ? 100 - (value / maxValue) * 100 : 100;
            return `${x},${y}`;
        }).join(' ');
        
        return (
            <div className="relative h-64">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <polyline
                        points={points}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-primary"
                    />
                    {data.map((value, index) => {
                        const x = (index / (data.length - 1)) * 100;
                        const y = maxValue > 0 ? 100 - (value / maxValue) * 100 : 100;
                        return (
                            <circle
                                key={index}
                                cx={x}
                                cy={y}
                                r="2"
                                className="fill-current text-primary"
                            />
                        );
                    })}
                </svg>
                <div className="absolute bottom-0 left-0 right-0 flex justify-between">
                    {labels.map((label, index) => (
                        <span key={index} className="text-xs text-base-content/60 truncate">
                            {label}
                        </span>
                    ))}
                </div>
            </div>
        );
    }
    
    if (type === 'pie') {
        const total = data.reduce((sum, value) => sum + value, 0);
        let currentAngle = 0;
        
        return (
            <div className="relative h-64 flex items-center justify-center">
                <svg className="w-48 h-48" viewBox="0 0 100 100">
                    {data.map((value, index) => {
                        const percentage = total > 0 ? (value / total) * 100 : 0;
                        const angle = (percentage / 100) * 360;
                        const startAngle = currentAngle;
                        const endAngle = currentAngle + angle;
                        
                        const x1 = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
                        const y1 = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
                        const x2 = 50 + 40 * Math.cos((endAngle - 90) * Math.PI / 180);
                        const y2 = 50 + 40 * Math.sin((endAngle - 90) * Math.PI / 180);
                        
                        const largeArcFlag = angle > 180 ? 1 : 0;
                        
                        const pathData = [
                            `M 50 50`,
                            `L ${x1} ${y1}`,
                            `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                            'Z'
                        ].join(' ');
                        
                        currentAngle += angle;
                        
                        return (
                            <path
                                key={index}
                                d={pathData}
                                className={`fill-current text-${['primary', 'success', 'warning', 'info', 'error'][index % 5]}`}
                                title={`${labels[index]}: ${value} (${percentage.toFixed(1)}%)`}
                            />
                        );
                    })}
                </svg>
            </div>
        );
    }
    
    return null;
};

export default Chart;
