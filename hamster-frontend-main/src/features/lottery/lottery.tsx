import React, { useState, useEffect } from 'react';
//import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const DefiGamefiLotterySystem = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [poolAmount, setPoolAmount] = useState(0);
  const [participants, setParticipants] = useState(0);
  const [winner, setWinner] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [roundFinished, setRoundFinished] = useState(false);
  const [history, setHistory] = useState([]);
  const [winnerIndex, setWinnerIndex] = useState(0);
  const [airdropAmounts, setAirdropAmounts] = useState([]);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [stakedAmount, setStakedAmount] = useState(0);
  const [stakingRewards, setStakingRewards] = useState(0);
  const [inviteRewards, setInviteRewards] = useState(0);
  const [useStakingRewardsForLottery, setUseStakingRewardsForLottery] = useState(false);

  const MINIMUM_CONTRIBUTION = 0.1; // ETH
  const TOTAL_PARTICIPANTS = 10;
  const TOTAL_POOL = 1; // ETH
  const STAKING_RATE = 0.1; // 10% annual return
  const INVITE_REWARD = 0.01; // 0.01 ETH per invite

  useEffect(() => {
    if (participants >= TOTAL_PARTICIPANTS || timeLeft === 0) {
      drawWinner();
    }
  }, [participants, timeLeft]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);


    

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const stakingTimer = setInterval(() => {
      setStakingRewards((prevRewards) => prevRewards + (stakedAmount * STAKING_RATE) / (365 * 24 * 60 * 60));
    }, 1000);

    return () => clearInterval(stakingTimer);
  }, [stakedAmount]);

  const connectWallet = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setWalletConnected(true);
      setAddress('0x1234...5678');
      setIsLoading(false);
    }, 1000);
  };

  const participateInLottery = async () => {
    setIsLoading(true);
    setTimeout(() => {
      if (useStakingRewardsForLottery && stakingRewards >= MINIMUM_CONTRIBUTION) {
        setStakingRewards((prev) => prev - MINIMUM_CONTRIBUTION);
      } else {
        // Deduct from wallet balance (not implemented in this example)
      }
      setPoolAmount((prevAmount) => prevAmount + MINIMUM_CONTRIBUTION);
      setParticipants((prevParticipants) => prevParticipants + 1);
      setIsLoading(false);
    }, 1000);
  };

  const drawWinner = () => {
    setIsLoading(true);
    setTimeout(() => {
      const randomWinner = `0x${Math.floor(Math.random() * 1000000).toString(16)}`;
      const winnerIdx = Math.floor(Math.random() * TOTAL_PARTICIPANTS) + 1;
      setWinner(randomWinner);
      setWinnerIndex(winnerIdx);
      setRoundFinished(true);
      setHistory((prev) => [...prev, { winner: randomWinner, winnerIndex: winnerIdx }]);
      generateAirdropAmounts(winnerIdx);
      setIsLoading(false);
    }, 2000);
  };

  const generateAirdropAmounts = (winnerIdx) => {
    const amounts = [];
    for (let i = 1; i <= TOTAL_PARTICIPANTS; i++) {
      if (i !== winnerIdx) {
        amounts.push(Math.floor(Math.random() * 100) + 1);
      } else {
        amounts.push(0);
      }
    }
    setAirdropAmounts(amounts);
  };

  const startNewRound = () => {
    setPoolAmount(0);
    setParticipants(0);
    setWinner('');
    setRoundFinished(false);
    setWinnerIndex(0);
    setAirdropAmounts([]);
    setTimeLeft(600);
  };

  const shareToTelegram = () => {
    const shareText = roundFinished
      ? `我在Dropin Defi Gamefi第${history.length}轮参与了抽奖！中奖地址是${winner}，奖金是${(TOTAL_POOL * 0.9).toFixed(2)} ETH。快来加入下一轮吧！`
      : `我正在参与Dropin Defi Gamefi第${history.length + 1}轮抽奖！还有${formatTime(timeLeft)}开奖，快来加入吧！`;
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(shareText)}`;
    
    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.openTelegramLink(shareUrl);
    } else {
      window.open(shareUrl, '_blank');
    }
    
    setInviteRewards((prev) => prev + INVITE_REWARD);
  };

  const stakeWinnings = () => {
    if (roundFinished && winnerIndex > 0) {
      const winningAmount = TOTAL_POOL * 0.9;
      setStakedAmount((prev) => prev + winningAmount);
      setPoolAmount((prev) => prev - winningAmount);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 text-gray-300 rounded-lg shadow-lg">
      <img src="/api/placeholder/100/100" alt="Dropin Logo" className="w-24 h-24 mx-auto mb-6" />
      <h1 className="text-3xl font-bold text-center text-teal-400 mb-6">Dropin Defi Gamefi</h1>
      
      {!walletConnected ? (
        <button 
          onClick={connectWallet} 
          disabled={isLoading} 
          className="w-full py-2 px-4 bg-teal-500 text-gray-900 rounded font-bold hover:bg-teal-600 transition-colors"
        >
          {isLoading ? '连接中...' : '连接钱包'}
        </button>
      ) : (
        <>
          {/* <Alert className="mb-4">
            <AlertTitle>当前钱包地址</AlertTitle>
            <AlertDescription>{address}</AlertDescription>
          </Alert> */}
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p>奖池金额: {poolAmount.toFixed(2)} ETH</p>
              <p>参与人数: {participants}/{TOTAL_PARTICIPANTS}</p>
            </div>
            <div>
              <p>倒计时: {formatTime(timeLeft)}</p>
              <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
                <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: `${(participants / TOTAL_PARTICIPANTS) * 100}%` }}></div>
              </div>
            </div>
          </div>
          
          {!roundFinished ? (
            <div>
              <button 
                onClick={participateInLottery} 
                disabled={isLoading || participants >= TOTAL_PARTICIPANTS} 
                className="w-full py-2 px-4 bg-teal-500 text-gray-900 rounded font-bold hover:bg-teal-600 transition-colors mb-2"
              >
                {isLoading ? '处理中...' : `参与游戏 (${MINIMUM_CONTRIBUTION} ETH)`}
              </button>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={useStakingRewardsForLottery}
                  onChange={(e) => setUseStakingRewardsForLottery(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-teal-600"
                />
                <span>使用质押收益参与游戏</span>
              </label>
            </div>
          ) : (
            <div className="bg-gray-800 p-4 rounded-lg mb-4">
              <p className="text-xl font-bold text-teal-400 mb-2">
                恭喜第{winnerIndex}位地址赢得{(TOTAL_POOL * 0.9).toFixed(2)}ETH奖励！
              </p>
              {airdropAmounts.map((amount, index) => (
                amount > 0 && (
                  <p key={index} className="text-sm mb-1">
                    恭喜第{index + 1}个地址，获得Token空投约{amount}枚
                  </p>
                )
              ))}
              <button 
                onClick={startNewRound} 
                className="w-full py-2 px-4 bg-teal-500 text-gray-900 rounded font-bold hover:bg-teal-600 transition-colors mt-4"
              >
                开始新一轮
              </button>
            </div>
          )}

          <button 
            onClick={shareToTelegram} 
            className="w-full py-2 px-4 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition-colors mb-4"
          >
            分享到Telegram
          </button>
          <p>邀请奖励: {inviteRewards.toFixed(2)} ETH</p>

          <div className="bg-gray-800 p-4 rounded-lg mt-6">
            <h2 className="text-xl font-bold text-teal-400 mb-4">质押池</h2>
            <p>已质押金额: {stakedAmount.toFixed(2)} ETH</p>
            <p>质押收益: {stakingRewards.toFixed(6)} ETH</p>
            <button 
              onClick={stakeWinnings} 
              disabled={!roundFinished || winnerIndex === 0}
              className="w-full py-2 px-4 bg-teal-500 text-gray-900 rounded font-bold hover:bg-teal-600 transition-colors mt-4"
            >
              质押奖金
            </button>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-bold text-teal-400 mb-4">历史获奖记录</h2>
            <div className="max-h-48 overflow-y-auto bg-gray-800 p-4 rounded-lg">
              {history.map((record, index) => (
                <p key={index} className="text-sm mb-2">
                  第{index + 1}轮: 第{record.winnerIndex}位地址 ({record.winner}) 获胜
                </p>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DefiGamefiLotterySystem;
