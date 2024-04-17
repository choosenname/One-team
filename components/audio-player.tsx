import React from 'react';

interface AudioPlayerProps {
    src: string;
    type: string;
    className?: string;
}

const AudioPlayer = ({ src, type, className }: AudioPlayerProps) => {
    return (
        <div className={className}>
            <h1>Audio Player</h1>
            <audio controls>
                {/* Используем переданные параметры для источника аудио */}
                <source src={src} type={type} />
                {/* Добавьте другие источники для поддержки различных форматов аудио */}
                Your browser does not support the audio tag.
            </audio>
        </div>
    );
};

export default AudioPlayer;
