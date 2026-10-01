import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';

// Figura humanóide procedural simples, usada apenas como placeholder visual
// enquanto não existe um avatar.glb real vindo do Tripo AI.
export function AvatarPlaceholderModel() {
  const group = useRef<Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.position.y = -1.55 + Math.sin(state.clock.elapsedTime * 1.2) * 0.03;
    }
  });

  const skin = '#E8C9A8';
  const outfit = '#221B33';

  return (
    <group ref={group} position={[0, -1.55, 0]}>
      {/* cabeça */}
      <mesh position={[0, 3.15, 0]} castShadow>
        <sphereGeometry args={[0.26, 32, 32]} />
        <meshStandardMaterial color={skin} roughness={0.6} />
      </mesh>
      {/* pescoço */}
      <mesh position={[0, 2.86, 0]}>
        <cylinderGeometry args={[0.08, 0.09, 0.14, 16]} />
        <meshStandardMaterial color={skin} roughness={0.6} />
      </mesh>
      {/* tronco */}
      <mesh position={[0, 2.35, 0]} castShadow>
        <capsuleGeometry args={[0.32, 0.75, 8, 16]} />
        <meshStandardMaterial color={outfit} roughness={0.7} />
      </mesh>
      {/* quadril */}
      <mesh position={[0, 1.72, 0]}>
        <capsuleGeometry args={[0.3, 0.2, 8, 16]} />
        <meshStandardMaterial color={outfit} roughness={0.7} />
      </mesh>
      {/* braço esquerdo */}
      <mesh position={[-0.46, 2.25, 0]} rotation={[0, 0, 0.15]} castShadow>
        <capsuleGeometry args={[0.09, 0.75, 8, 16]} />
        <meshStandardMaterial color={skin} roughness={0.6} />
      </mesh>
      {/* braço direito */}
      <mesh position={[0.46, 2.25, 0]} rotation={[0, 0, -0.15]} castShadow>
        <capsuleGeometry args={[0.09, 0.75, 8, 16]} />
        <meshStandardMaterial color={skin} roughness={0.6} />
      </mesh>
      {/* perna esquerda */}
      <mesh position={[-0.16, 0.85, 0]} castShadow>
        <capsuleGeometry args={[0.13, 0.95, 8, 16]} />
        <meshStandardMaterial color="#3A3050" roughness={0.7} />
      </mesh>
      {/* perna direita */}
      <mesh position={[0.16, 0.85, 0]} castShadow>
        <capsuleGeometry args={[0.13, 0.95, 8, 16]} />
        <meshStandardMaterial color="#3A3050" roughness={0.7} />
      </mesh>
      {/* base / sombra de contato */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[0.6, 32]} />
        <meshStandardMaterial color="#000000" transparent opacity={0.06} />
      </mesh>
    </group>
  );
}
