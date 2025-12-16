import { useTheLab } from '../../lib/hooks/useTheLab'

type Props = {}

const TheLab  = (props: Props) => {
  const {
    TheLab,
    isLoading,
    error,
  } = useTheLab();
  if(!error && TheLab && !isLoading){
    console.log(TheLab[0]);
  }
  return (

    <h1 style={{ marginBottom: '30rem' }}>
    Welcome to the lab
    </h1>




  )
}

export default TheLab