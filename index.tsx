import BigNumber from 'bignumber.js'
import useFarms from '../../hooks/useFarms'
import useAllStakedValue, {
  StakedValue,
} from '../../hooks/useAllStakedValue'
import useCDOPerYear from '../../hooks/useCDOPerYear'

import { Farm } from '../../contexts/Farms'

import useCDOPrice from '../../hooks/useCDOPrice'
import useWBNBPrice from '../../hooks/useWBNBPrice'

import { CodexStakingTableRow } from './codexStakingTableRow'
import './index.scss';

interface FarmWithStakedValue extends Farm, StakedValue {
  apy: BigNumber,
  tvl: BigNumber
}

export const CodexStakingTable = () => {
  const [farms] = useFarms()
  const stakedValue = useAllStakedValue()
  const bnbPrice = useWBNBPrice()
  const cdoPrice = useCDOPrice()

  const cdoPerYear = useCDOPerYear()

  console.log(cdoPrice.toFormat(2))
  console.log(bnbPrice.toFormat(2))

  const rows = farms.reduce<FarmWithStakedValue[]>(
    (farmRows, farm, i) => {

      const newFarmRows = [...farmRows]
      const farmWithStakedValue = {
        ...farm,
        ...stakedValue[i],
        apy: stakedValue[i] && cdoPerYear.isGreaterThan(0) && stakedValue[i].totalWethValue.isGreaterThan(0)
          ? cdoPrice
            .times(cdoPerYear)
            .times(stakedValue[i].poolWeight)
            .div(stakedValue[i].totalWethValue)
            .div(bnbPrice)
          : null,
        tvl: stakedValue[i] && stakedValue[i].totalWethValue.isGreaterThan(0)
          ? stakedValue[i].totalWethValue.times(bnbPrice)
          : null,
      }

      newFarmRows.push(farmWithStakedValue)
      return newFarmRows
    },
    [],
  )

  return (
    <div className="codexStakingTableWrap">
      <div className="codexStakingTable">
        {
          rows.map((farm, i) => (
            <CodexStakingTableRow key={i} farm={farm} isFirst={i === 0} />
          ))
        }
      </div>
    </div>
  )
}
