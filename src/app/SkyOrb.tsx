import React from 'react';
import { Sphere } from 'drei';

const SkyOrb = () => {
    return (
        <Sphere args={[10, 32, 32]}>
            <meshBasicMaterial color="yellow" emissive="yellow" />
        </Sphere>
    );
};

export default SkyOrb;