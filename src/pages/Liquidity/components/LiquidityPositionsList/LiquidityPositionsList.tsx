import { PoolId } from '@ergolabs/ergo-dex-sdk';
import { Button, Flex, List, PlusOutlined } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { useObservable } from '../../../../common/hooks/useObservable';
import { AmmPool } from '../../../../common/models/AmmPool';
import { isWalletSetuped$ } from '../../../../gateway/api/wallets';
import { EmptyPositionsList } from '../../common/EmptyPositionsList/EmptyPositionsList';
import { EmptySearchResult } from '../../common/EmptySearchResult/EmptySearchResult';
import { PositionListLoader } from '../PositionListLoader/PositionListLoader';
import { LiquidityPositionsItem } from './LiquidityPositionsItem/LiquidityPositionsItem';

interface LiquidityPositionsListProps {
  loading: boolean;
  totalCount: number;
  pools: AmmPool[];
}

const LiquidityPositionsList: FC<LiquidityPositionsListProps> = ({
  loading,
  pools,
  totalCount,
}): JSX.Element => {
  const [isWalletConnected] = useObservable(isWalletSetuped$, [], false);

  const navigate = useNavigate();

  const onPositionClick = (id: PoolId) => {
    if (isWalletConnected) {
      navigate(`${id}`);
    }
  };

  function handleAddLiquidity() {
    navigate('add');
  }

  if (loading) {
    return <PositionListLoader />;
  }

  if (!totalCount && !loading) {
    return (
      <EmptyPositionsList>
        <Button
          type="primary"
          size="middle"
          onClick={handleAddLiquidity}
          icon={<PlusOutlined />}
        >
          {' '}
          <Trans>Add Liquidity</Trans>
        </Button>
      </EmptyPositionsList>
    );
  }

  return (
    <Flex col>
      <List
        dataSource={pools}
        gap={2}
        emptyTemplate={<EmptySearchResult />}
        maxHeight={410}
      >
        {(pool) => (
          <LiquidityPositionsItem pool={pool} onClick={onPositionClick} />
        )}
      </List>
    </Flex>
  );
};

export { LiquidityPositionsList };