import { test, expect } from "vitest";
import { render } from "@solidjs/testing-library";
import { Counter } from "@components/home/Counter";
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();

test("increments value", async () => {
    const { getByRole } = render(() => <Counter />);
    const counter = getByRole("button");
    expect(counter).toHaveTextContent("1");
    await user.click(counter);
    expect(counter).toHaveTextContent("2");
});
