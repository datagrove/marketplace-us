import { Match, Switch } from 'solid-js';

export type HeadingProps = {
  heading: string;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
};

export const getHeading = function (headingData: HeadingProps) {
  const defaultHeading = <h2 class="text-4xl font-bold">{headingData.heading}</h2>
  return (
    <Switch fallback={defaultHeading}>
      <Match when={headingData.headingLevel === 1}>
        <h1 class="text-5xl font-bold">{headingData.heading}</h1>
      </Match>
      <Match when={headingData.headingLevel === 2}>{defaultHeading}</Match>
      <Match when={headingData.headingLevel === 3}>
        <h3 class="text-3xl font-bold">{headingData.heading}</h3>
      </Match>
      <Match when={headingData.headingLevel === 4}>
        <h4 class="text-2xl font-bold">{headingData.heading}</h4>
      </Match>
      <Match when={headingData.headingLevel === 5}>
        <h5 class="text-xl font-bold">{headingData.heading}</h5>
      </Match>
      <Match when={headingData.headingLevel === 6}>
        <h6 class="text-lg font-bold">{headingData.heading}</h6>
      </Match>
    </Switch>
  );
};