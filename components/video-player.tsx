import React from 'react';

interface VideoPlayerProps {
    src: string;
    type: string;
    className?: string;
    width?: string | number;
    height?: string | number;
}

const VideoPlayer = ({ src, type, width, height }: VideoPlayerProps) => {
    return (
        <div>
            <video controls width={width} height={height}>
                {/* Используем переданные параметры для источника видео */}
                <source src={src} type={type} />
                {/* Добавьте другие источники для поддержки различных форматов видео */}
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default VideoPlayer;
