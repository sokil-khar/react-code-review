import { useState } from 'react';
import BigNumber from 'bignumber.js'
import { Farm } from '../../../contexts/Farms'
import { StakedValue } from '../../../hooks/useAllStakedValue'
import useTokenBalance from '../../../hooks/useTokenBalance'
import useStakedBalance from '../../../hooks/useStakedBalance'
import useAllowance from '../../../hooks/useAllowance'
import useEarnings from '../../../hooks/useEarnings'
import useEarned from '../../../hooks/useEarned'

import classNames from 'classnames';

import { StakeUnstake } from '../../stakeUnstakeBlock'
import { TotalCodexRewards } from '../../totalCodexRewards'
import './index.scss';

interface FarmWithStakedValue extends Farm, StakedValue {
	apy: BigNumber,
	tvl: BigNumber
}

interface CodexStakingTableRowProps {
	farm: FarmWithStakedValue,
	isFirst?: boolean
}

export const CodexStakingTableRow = ({ farm, isFirst }: CodexStakingTableRowProps) => {
	const [expanded, setExpanded] = useState(false);
	const onExpand = () => setExpanded(!expanded);
	const targetContract = farm.lpStaking ? farm.lpContract : farm.tokenContract
	const allowance = useAllowance(targetContract)
	const tokenBalance = useTokenBalance(farm.lpStaking ? farm.lpTokenAddress : farm.tokenAddress)
	const stakedBalance = useStakedBalance(farm.pid)
	const earnings = useEarnings(farm.pid)
	const earned = useEarned(farm.pid)


	return <>
		<div className={classNames('codexStakingTableRow', { '--expanded': expanded })}>
			<div className="codexStakingTableRowItem">
				{
					farm.imgSrc.map((img, i) => <img key={i} src={img} alt="icon-pool" />)
				}
			</div>
			<div className="codexStakingTableRowItem">
				<div className="codexStakingTableTextBold">{farm.name}</div>
				<div className="codexStakingTableText">
					{`Stake ${farm.name} to earn CDO.Finance rewards`}
					{
						isFirst &&
						<> (Read a <a href="https://app.gitbook.com/@cdo-finance/s/cdo-finance/user-guide/pancakeswap-lp-token-staking">step-by-step guide</a> on how to get the LP Token.)</>
					}
				</div>
			</div>
			<div className="codexStakingTableRowItem">
				<div className="codexStakingTableApy">{`apy ${farm.apy == null ? 0 : new BigNumber(1).plus(farm.apy).times(100).toFormat(2)}%`}</div>
			</div>
			<div className="codexStakingTableRowItem">
				<div className="codexStakingTableCdoEarned">{`CODEX earned: ${earned.toFormat(2)}`}</div>
			</div>
			<div className="codexStakingTableRowItem">
				<div className="codexStakingTableExpand">
					<img
						className="codexStakingTableExpandImg"
						src="/images/icons/expand.svg"
						alt="expand"
						onClick={onExpand}
					/>
				</div>
			</div>
		</div>
		{
			expanded &&
			<div className={classNames('codexStakingTableRowExpanded', { '--expanded': expanded })}>
				<StakeUnstake title={farm.name} balance={tokenBalance.div(10 ** 18)} allowance={allowance} pid={farm.pid} targetContract={targetContract} />
				<StakeUnstake title={farm.name} balance={stakedBalance.div(10 ** 18)} isUnstake pid={farm.pid} targetContract={targetContract} />
				<TotalCodexRewards pid={farm.pid} amount={earnings.toFormat(2)} />
			</div>
		}
	</>
};
