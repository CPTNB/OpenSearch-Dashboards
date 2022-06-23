/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { i18n } from '@osd/i18n';
import React, { useMemo } from 'react';
import { PLUGIN_ID } from '../../../common';
import { useOpenSearchDashboards } from '../../../../opensearch_dashboards_react/public';
import { getTopNavconfig } from '../utils/get_top_nav_config';
import { WizardServices } from '../../types';

import './top_nav.scss';
import { useIndexPattern } from '../utils/use';

export const TopNav = () => {
  const { services } = useOpenSearchDashboards<WizardServices>();
  const {
    setHeaderActionMenu,
    chrome,
    navigation: {
      ui: { TopNavMenu },
    },
  } = services;

  const config = useMemo(() => getTopNavconfig(services), [services]);
  const indexPattern = useIndexPattern();

  chrome.setBreadcrumbs([
    {
      text: i18n.translate('visualize.listing.breadcrumb', {
        defaultMessage: 'Visualize',
      }),
      href: `/`,
    },
    {
      text: i18n.translate('wizard.nav.breadcrumb.create', {
        defaultMessage: 'Create',
      })
    }
  ]);

  return (
    <div className="wizTopNav">
      <TopNavMenu
        appName={PLUGIN_ID}
        config={config}
        setMenuMountPoint={setHeaderActionMenu}
        showSearchBar={true}
        useDefaultBehaviors={true}
        screenTitle="Test"
        indexPatterns={indexPattern ? [indexPattern] : []}
      />
    </div>
  );
};
