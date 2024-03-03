export default function Box(props) {
  return (
    <mesh {...props} >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="white"/>
    </mesh>
  )
}