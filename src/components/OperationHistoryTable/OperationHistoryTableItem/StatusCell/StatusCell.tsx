import React, { FC } from 'react';
import styled from 'styled-components';

import { OperationStatus } from '../../../../common/models/Operation';
import {
  Box,
  CheckOutlined,
  Flex,
  Loading3QuartersOutlined,
  LockOutlined,
  Tag,
  Typography,
} from '../../../../ergodex-cdk';

interface InnerStatusCellProps {
  readonly className?: string;
}

interface StatusCellProps {
  readonly status: OperationStatus;
}

const ExecutedStatusCell: FC = () => (
  <Tag color="success">
    <Flex>
      <Flex.Item marginRight={1}>
        <CheckOutlined />
      </Flex.Item>
      Executed
    </Flex>
  </Tag>
);

const PendingStatusCell: FC = () => (
  <Tag color="processing">
    <Flex>
      <Flex.Item marginRight={1}>
        <Loading3QuartersOutlined />
      </Flex.Item>
      Pending
    </Flex>
  </Tag>
);

const LockedStatusCell: FC = () => (
  <Tag color="warning">
    <Flex>
      <Flex.Item marginRight={1}>
        <LockOutlined />
      </Flex.Item>
      Locked
    </Flex>
  </Tag>
);

export const StatusCell: FC<StatusCellProps> = ({ status }) => (
  <Flex justify="flex-start">
    {status === OperationStatus.Executed && <ExecutedStatusCell />}
    {status === OperationStatus.Pending && <PendingStatusCell />}
    {status === OperationStatus.Locked && <LockedStatusCell />}
  </Flex>
);