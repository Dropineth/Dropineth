import { Container } from '@/components';
import { Count } from '@/features/count/count';
import  DefiGamefiLotterySystem  from '@/features/lottery/lottery'

export default function Home() {
  return (
    <Container>
     <DefiGamefiLotterySystem />
      {/* <Count/> */}
    </Container>
  );
};
