import { Match, Switch } from 'solid-js';

export type HeadingProps = {
  heading: string;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
};

export const getHeading = function (headingData: HeadingProps) {
  const defaultHeading = <h2>{headingData.heading}</h2>;
  return (
    <Switch fallback={defaultHeading}>
      <Match when={headingData.headingLevel === 1}>
        <h1>{headingData.heading}</h1>;
      </Match>
      <Match when={headingData.headingLevel === 2}>{defaultHeading}</Match>
      <Match when={headingData.headingLevel === 3}>
        <h3>{headingData.heading}</h3>;
      </Match>
      <Match when={headingData.headingLevel === 4}>
        <h4>{headingData.heading}</h4>;
      </Match>
      <Match when={headingData.headingLevel === 5}>
        <h5>{headingData.heading}</h5>;
      </Match>
      <Match when={headingData.headingLevel === 6}>
        <h6>{headingData.heading}</h6>;
      </Match>
    </Switch>
  );
};