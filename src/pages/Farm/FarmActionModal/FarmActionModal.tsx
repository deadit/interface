import { Flex, Form, Modal, Typography, useForm } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React from 'react';
import { skip } from 'rxjs';
import styled from 'styled-components';

import {
  useObservable,
  useSubscription,
} from '../../../common/hooks/useObservable';
import { AssetInfo } from '../../../common/models/AssetInfo';
import { Currency } from '../../../common/models/Currency';
import { LmPool } from '../../../common/models/LmPool';
import { AssetIconPair } from '../../../components/AssetIconPair/AssetIconPair';
import { DataTag } from '../../../components/common/DataTag/DataTag';
import { FormPairSection } from '../../../components/common/FormView/FormPairSection/FormPairSection';
import { FormSlider } from '../../../components/common/FormView/FormSlider/FormSlider';
import { OperationForm } from '../../../components/OperationForm/OperationForm';
import { PageSection } from '../../../components/Page/PageSection/PageSection';
import { FarmHeaderAssets } from '../FarmGridView/FarmCardView/FarmCardView';

interface FarmActionModalProps {
  pool: LmPool;
  onClose: (request?: any) => void;
  operation: 'withdrawal' | 'stake';
}

interface FarmActionModalHeaderProps {
  className?: string;
  assetX: AssetInfo;
  assetY: AssetInfo;
}

const _FarmActionModalHeader: React.FC<FarmActionModalHeaderProps> = ({
  className,
  assetX,
  assetY,
}) => {
  return (
    <Flex className={className} col gap={8}>
      Stake {assetX.ticker}/{assetY.ticker} liquidity
      <Flex justify="space-between">
        <Flex col align="flex-start">
          <WhiteText>
            <Trans>Total Staked</Trans>
          </WhiteText>
          <DataTag content="$---" />
        </Flex>
        <Flex col align="flex-end">
          <WhiteText>
            <Trans>APR</Trans>
          </WhiteText>
          <DataTag content="30%" />
        </Flex>
        <FarmHeaderAssets>
          <AssetIconPair assetX={assetX} assetY={assetY} size="extraLarge" />
        </FarmHeaderAssets>
      </Flex>
    </Flex>
  );
};

export const FarmActionModalHeader = styled(_FarmActionModalHeader)`
  position: relative;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  background: linear-gradient(180deg, #764ca3 0%, #677de7 100%) !important;
  padding: 24px;
  margin: -16px -16px 32px;
  height: 164px;
  color: var(--spectrum-text-white);
`;

const WhiteText = styled(Typography.Text)`
  color: var(--spectrum-text-white) !important;
`;

export const Caption = styled(Typography.Body)`
  font-size: 16px !important;
  line-height: 24px !important;
`;

const marks = {
  0: '0%',
  25: '25%',
  50: '50%',
  75: '75%',
  100: 'Max',
};

export interface FormModel {
  readonly percent: number;
  readonly xAmount?: Currency;
  readonly yAmount?: Currency;
  readonly lpAmount?: Currency;
}

export const FarmActionModal: React.FC<FarmActionModalProps> = ({
  pool,
  operation = 'withdrawal',
}) => {
  const form = useForm<FormModel>({
    percent: 50,
    xAmount: undefined,
    yAmount: undefined,
    lpAmount: undefined,
  });

  const availableAssetX =
    operation === 'withdrawal' ? pool.yourStake[0] : pool.availableLqShares[0];

  const availableAssetY =
    operation === 'withdrawal' ? pool.yourStake[1] : pool.availableLqShares[1];

  const availableFarmTokens =
    operation === 'withdrawal' ? pool.balanceVlq : pool.balanceLq;

  const [formValue] = useObservable(form.valueChangesWithSilent$);

  useSubscription(
    form.controls.percent.valueChanges$.pipe(skip(1)),
    (percent) => {
      form.patchValue({
        xAmount:
          percent === 100 ? availableAssetX : availableAssetX.percent(percent),
        yAmount:
          percent === 100 ? availableAssetY : availableAssetY.percent(percent),
        lpAmount:
          percent === 100
            ? availableFarmTokens
            : availableFarmTokens.percent(percent),
      });
    },
    [],
  );
  return (
    <>
      <Modal.Title>
        <FarmActionModalHeader
          assetX={pool.ammPool.x.asset}
          assetY={pool.ammPool.y.asset}
        />
      </Modal.Title>
      <Modal.Content maxWidth={480} width="100%">
        <OperationForm
          analytics={{ location: 'create-farm' }}
          form={form}
          onSubmit={() => console.log('confirm')}
          actionCaption={t`Withdraw`}
        >
          <PageSection title={t`Amount`} noPadding>
            <Flex gap={4} col>
              <Form.Item name="percent">
                {({ value, onChange }) => (
                  <FormSlider value={value} onChange={onChange} />
                )}
              </Form.Item>
              <FormPairSection
                title={''}
                xAmount={formValue?.xAmount || availableAssetX}
                yAmount={formValue?.yAmount || availableAssetY}
              />
            </Flex>
          </PageSection>
        </OperationForm>
      </Modal.Content>
    </>
  );
};