import { test, expect } from "vitest";
import { render } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { Home } from "@components/home/Home";

const user = userEvent.setup();

test("increments value", async () => {
    const { getByRole } = render(() => <Home />);
    const counter = getByRole("button");
    expect(counter).toHaveTextContent("1");
    await user.click(counter);
    expect(counter).toHaveTextContent("2");
});
