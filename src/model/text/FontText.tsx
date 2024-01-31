import { Text } from '@react-three/drei';
import { MeshBasicMaterial, MeshStandardMaterial, Vector3 } from 'three';

export default function Component ({
  theFont = '/fonts/marko.ttf',
  children,
  ...props
}:any)  {

  return (
        
        
        <Text {...props} font={theFont} textAlign='left' 
        >
        {children}
      </Text>
  );
};