import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { ReactElement } from "react";

export const renderWithRouter = (element: ReactElement) => {
  return render(<MemoryRouter>{element}</MemoryRouter>);
};
