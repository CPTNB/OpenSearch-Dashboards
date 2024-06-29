/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Any modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { Component } from 'react';

import {
  EuiLoadingSpinner,
  EuiButton,
  EuiFormRow,
  EuiFlexGroup,
  EuiSpacer,
  EuiFlexItem,
  EuiFieldText,
  EuiPanel,
  EuiCheckbox,
} from '@elastic/eui';
import * as Rx from 'rxjs';
import {
  withEmbeddableSubscription,
  ContainerOutput,
  EmbeddableOutput,
  EmbeddableStart,
} from '../../../../src/plugins/embeddable/public';
import { SearchableListContainer, SearchableContainerInput } from './searchable_list_container';

interface Props {
  embeddable: SearchableListContainer;
  input: SearchableContainerInput;
  output: ContainerOutput;
  embeddableServices: EmbeddableStart;
}

interface State {
  checked: { [key: string]: boolean };
  hasMatch: { [key: string]: boolean };
}

interface HasMatchOutput {
  hasMatch: boolean;
}

function hasHasMatchOutput(output: EmbeddableOutput | HasMatchOutput): output is HasMatchOutput {
  return (output as HasMatchOutput).hasMatch !== undefined;
}

export class SearchableListContainerComponentInner extends Component<Props, State> {
  private subscriptions: { [id: string]: Rx.Subscription } = {};
  constructor(props: Props) {
    super(props);

    const checked: { [id: string]: boolean } = {};
    const hasMatch: { [id: string]: boolean } = {};
    props.embeddable.getChildIds().forEach((id) => {
      checked[id] = false;
      const output = props.embeddable.getChild(id).getOutput();
      hasMatch[id] = hasHasMatchOutput(output) && output.hasMatch;
    });
    this.state = {
      checked,
      hasMatch,
    };
  }

  componentDidMount() {
    this.props.embeddable.getChildIds().forEach((id) => {
      this.subscriptions[id] = this.props.embeddable
        .getChild(id)
        .getOutput$()
        .subscribe((output) => {
          if (hasHasMatchOutput(output)) {
            this.setState((prevState) => ({
              hasMatch: {
                ...prevState.hasMatch,
                [id]: output.hasMatch,
              },
            }));
          }
        });
    });
  }

  componentWillUnmount() {
    Object.values(this.subscriptions).forEach((sub) => sub.unsubscribe());
  }

  private updateSearch = (search: string) => {
    this.props.embeddable.updateInput({ search });
  };

  private deleteChecked = () => {
    Object.values(this.props.input.panels).map((panel) => {
      if (this.state.checked[panel.explicitInput.id]) {
        this.props.embeddable.removeEmbeddable(panel.explicitInput.id);
        this.subscriptions[panel.explicitInput.id].unsubscribe();
      }
    });
  };

  private checkMatching = () => {
    const { input, embeddable } = this.props;
    const checked: { [key: string]: boolean } = {};
    Object.values(input.panels).map((panel) => {
      const child = embeddable.getChild(panel.explicitInput.id);
      const output = child.getOutput();
      if (hasHasMatchOutput(output) && output.hasMatch) {
        checked[panel.explicitInput.id] = true;
      }
    });
    this.setState({ checked });
  };

  private toggleCheck = (isChecked: boolean, id: string) => {
    this.setState((prevState) => ({ checked: { ...prevState.checked, [id]: isChecked } }));
  };

  public renderControls() {
    const { input } = this.props;
    return (
      <EuiFlexGroup gutterSize="s">
        <EuiFlexItem grow={false}>
          <EuiFormRow hasEmptyLabelSpace>
            <EuiButton data-test-subj="deleteCheckedTodos" onClick={() => this.deleteChecked()}>
              Delete checked
            </EuiButton>
          </EuiFormRow>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiFormRow hasEmptyLabelSpace>
            <EuiButton
              data-test-subj="checkMatchingTodos"
              disabled={input.search === ''}
              onClick={() => this.checkMatching()}
            >
              Check matching
            </EuiButton>
          </EuiFormRow>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiFormRow label="Filter">
            <EuiFieldText
              data-test-subj="filterTodos"
              value={this.props.input.search || ''}
              onChange={(ev) => this.updateSearch(ev.target.value)}
            />
          </EuiFormRow>
        </EuiFlexItem>
        <EuiFlexItem />
      </EuiFlexGroup>
    );
  }

  public render() {
    const { embeddable } = this.props;
    return (
      <EuiFlexGroup gutterSize="none">
        <EuiFlexItem>
          <h2 data-test-subj="searchableListContainerTitle">{embeddable.getTitle()}</h2>
          <EuiSpacer size="l" />
          {this.renderControls()}
          <EuiSpacer size="l" />
          {this.renderList()}
        </EuiFlexItem>
      </EuiFlexGroup>
    );
  }

  private renderList() {
    const { embeddableServices, input, embeddable } = this.props;
    let id = 0;
    const list = Object.values(input.panels).map((panel) => {
      const childEmbeddable = embeddable.getChild(panel.explicitInput.id);
      id++;
      return childEmbeddable ? (
        <EuiPanel key={childEmbeddable.id}>
          <EuiFlexGroup gutterSize="none">
            <EuiFlexItem grow={false}>
              <EuiCheckbox
                data-test-subj={`todoCheckBox-${childEmbeddable.id}`}
                disabled={!childEmbeddable}
                id={childEmbeddable ? childEmbeddable.id : ''}
                checked={this.state.checked[childEmbeddable.id]}
                onChange={(e) => this.toggleCheck(e.target.checked, childEmbeddable.id)}
              />
            </EuiFlexItem>
            <EuiFlexItem>
              <embeddableServices.EmbeddablePanel embeddable={childEmbeddable} />
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiPanel>
      ) : (
        <EuiLoadingSpinner size="l" key={id} />
      );
    });
    return list;
  }
}

export const SearchableListContainerComponent = withEmbeddableSubscription<
  SearchableContainerInput,
  ContainerOutput,
  SearchableListContainer,
  { embeddableServices: EmbeddableStart }
>(SearchableListContainerComponentInner);
