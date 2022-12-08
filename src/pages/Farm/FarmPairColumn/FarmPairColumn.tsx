import { Flex, Tag } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { useObservable } from '../../../common/hooks/useObservable';
import { LmPool, LmStatuses } from '../../../common/models/LmPool';
import { AssetPairTitle } from '../../../components/AssetPairTitle/AssetPairTitle';
import { networkContext$ } from '../../../gateway/api/networkContext';

export interface PairColumnProps {
  readonly lmPool: LmPool;
  readonly direction?: 'col' | 'row';
  readonly align?: 'stretch' | 'center' | 'flex-start' | 'flex-end';
}

const getTag = (status: LmStatuses) => {
  if (status === LmStatuses.SCHEDULED) {
    return (
      <Tag color="orange">
        <Trans>Scheduled</Trans>
      </Tag>
    );
  }

  if (status === LmStatuses.FINISHED) {
    return (
      <Tag color="magenta">
        <Trans>Finished</Trans>
      </Tag>
    );
  }

  if (status === LmStatuses.LIVE) {
    return (
      <Tag color="green">
        <Trans>Live</Trans>
      </Tag>
    );
  }
};

export const FarmPairColumn: FC<PairColumnProps> = ({
  lmPool,
  direction = 'row',
  align = 'center',
}) => {
  return (
    <Flex align="center">
      <Flex.Item>
        <AssetPairTitle
          assetX={lmPool.ammPool.x.asset}
          assetY={lmPool.ammPool.y.asset}
          direction={direction}
          align={align}
        />
      </Flex.Item>
      <Flex.Item marginLeft={2}>{getTag(lmPool.currentStatus)}</Flex.Item>
    </Flex>
  );
};
