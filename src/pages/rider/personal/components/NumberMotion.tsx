import { useEffect, useState } from "react";
import React from "react";


export type NumberMotionProps = {
    number: number
};
const NumberMotion: React.FC<NumberMotionProps> = (props) => {
    const [number, setNumber] = useState(0)
    useEffect(() => {
        if (props.number != 0) {
            for (let index = 1; index <= 20; index++) {
                setTimeout(() => {
                    if (index == 20) {
                        setNumber(props.number)
                    } else {
                        setNumber(x => x + Math.floor(props.number / 20))
                    }
                }, 50 * index)
            }
        }
    }, [])
    return (
        <>
            {number}
        </>
    )
}

export default NumberMotion;