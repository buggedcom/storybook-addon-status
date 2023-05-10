import { addons, types, useParameter } from '@storybook/manager-api';
import { startCase } from 'lodash';
import React from 'react';

import StatusDot from './components/StatusDot';
import Status from './components/StatusTag';
import { ADDON_ID, ADDON_PARAM_KEY } from './constants';
import { defaultStatuses } from './defaults';

addons.register(ADDON_ID, () => {
  addons.add(ADDON_ID, {
    title: 'Status',
    type: types.TOOL,
    render: () => {
      const parameters = useParameter(
        ADDON_PARAM_KEY,
        null,
      );

      return <Status parameters={parameters} />
    },
  });

  addons.setConfig({
    sidebar: {
      renderLabel: (item) => {
        const { name, isLeaf, parameters } = item;
        // item can be a Root | Group | Story
        if (!isLeaf || !parameters || !parameters.status) {
          return name;
        }

        const { status } = parameters;

        const statusConfigMap = {
          ...defaultStatuses,
          ...(status.statuses || {}),
        };

        let statusName = '';

        if (Array.isArray(status.type)) {
          const firstStatus = status.type?.[0];
          statusName = typeof firstStatus === 'string' ? firstStatus : firstStatus.name;
        } else {
          statusName = status.type;
        }

        const statusConfig = statusConfigMap[statusName];

        if (!statusConfig) {
          return name;
        }

        const { background, description } = statusConfig;

        return (
          <>
            {name}
            <StatusDot
              type={statusName}
              background={background}
              title={`${startCase(statusName)}: ${description}`}
            />
          </>
        );
      },
    },
  });
});