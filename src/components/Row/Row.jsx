import React from 'react'

export default function Row({ guess, currentGuess }) {
    if (currentGuess){
        let letters = currentGuess.split('');
        return (
            <div className="row past">
                {letters.map((letter, i) => (
                    <div key={i} className="row-letter">{letter}</div>
                ))}
            </div>
        )
    }
    return (
        <div className="row">
            <div className="row-letter"></div>
            <div className="row-letter"></div>
            <div className="row-letter"></div>
            <div className="row-letter"></div>

        </div>
    )
}

