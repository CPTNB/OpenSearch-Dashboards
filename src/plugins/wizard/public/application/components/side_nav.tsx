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
import { setIndexPattern } from '../utils/state_management/datasource_slice';
import { useVisualizationType } from '../utils/use';
import { DataSource, DataSourceSelect } from './data_source_select';

export const SideNav = () => {
  const {
    services: {
      data,
      savedObjects: { client: savedObjectsClient },
    },
  } = useOpenSearchDashboards<WizardServices>();
  // const { IndexPatternSelect } = data.ui;
  const { dataSource } = useTypedSelector((state) => state.dataSource);
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
          savedObjectsClient={savedObjectsClient}
          // todo: remove the or
          selected={
            dataSource || {
              id:
                'this_is_a_data_sourcethis_is_a_data_sourcethis_is_a_data_sourcethis_is_a_data_sourcethis_is_a_data_sourcethis_is_a_data_source',
            }
          }
          onSelect={async (newDataSource: DataSource) => {
            // const newIndexPattern = await data.indexPatterns.get(newIndexPatternId);
            dispatch(setDataSource(newDataSource));
          }}
        />
      </div>
      <EuiTabbedContent tabs={tabs} className="wizSidenavTabs" />
    </section>
  );
};
