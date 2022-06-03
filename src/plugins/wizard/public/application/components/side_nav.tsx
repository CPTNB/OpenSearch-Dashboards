/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { i18n } from '@osd/i18n';
import { EuiFormLabel, EuiTabbedContent, EuiTabbedContentTab } from '@elastic/eui';
import { useOpenSearchDashboards } from '../../../../opensearch_dashboards_react/public';
import { WizardServices } from '../../types';
import './side_nav.scss';
import { useTypedDispatch, useTypedSelector } from '../utils/state_management';
import { setDataSource } from '../utils/state_management/datasource_slice';
import { useVisualizationType } from '../utils/use';
import { DataSource } from './data_source';
import { DataSourceSelect } from './data_source_select';

export const SideNav = () => {
  const {
    services: {
      data,
    },
  } = useOpenSearchDashboards<WizardServices>();
  // const { IndexPatternSelect } = data.ui;
  const { datasource } = useTypedSelector((state) => state.dataSource);
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
          selected={datasource}
          onChange={(newDatasource: DataSource) => {
            // const newIndexPattern = await data.indexPatterns.get(newIndexPatternId);
            dispatch(setDataSource(newDatasource));
          }}
        />
      </div>
      <EuiTabbedContent tabs={tabs} className="wizSidenavTabs" />
    </section>
  );
};
