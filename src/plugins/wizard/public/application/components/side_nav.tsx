/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EuiTabbedContent, EuiTabbedContentTab } from '@elastic/eui';
import './side_nav.scss';
import { useTypedDispatch, useTypedSelector } from '../utils/state_management';
import { setDataSourceId } from '../utils/state_management/datasource_slice';
import { useVisualizationType } from '../utils/use';
import { DataSource } from '../../types';
import { DataSourceSelect } from './data_source_select';

export const SideNav = () => {
  const { dataSource, dataSources } = useTypedSelector((state) => state.dataSource);
  const dispatch = useTypedDispatch();

  const {
    contributions: { containers },
  } = useVisualizationType();

  const tabs: EuiTabbedContentTab[] = containers.sidePanel.map(({ id, name, Component }) => ({
    id,
    name,
    content: Component,
  }));

  return (
    <section className="wizSidenav">
      <div className="wizDatasourceSelect">
        <DataSourceSelect
          selected={dataSource}
          dataSources={dataSources}
          onChange={(newDataSource?: DataSource) => {
            if (newDataSource !== undefined) {
              dispatch(setDataSourceId(newDataSource.id));
            }
          }}
        />
      </div>
      <EuiTabbedContent tabs={tabs} className="wizSidenavTabs" />
    </section>
  );
};
