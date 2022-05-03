import { map, Observable, publishReplay, refCount, tap, zip } from 'rxjs';

import { Balance } from '../../../../common/models/Balance';
import { ammPools$ } from '../ammPools/ammPools';
import { balanceItems$ } from './balance';

export const lpBalance$: Observable<Balance> = zip([
  balanceItems$,
  ammPools$,
]).pipe(
  map(([balanceItems, pools]) =>
    balanceItems.filter(([, info]) =>
      pools.some((p) => p.lp.asset.id === info.id),
    ),
  ),
  map((data) => new Balance(data)),
  publishReplay(1),
  refCount(),
);