import { Routes, Route } from "react-router-dom";
import publicRoutes from "./publicRoutes";
import privateRoutes from "./privateRoutes";

const allRoutes = [...publicRoutes, ...privateRoutes];

const RenderRoutes = () => {
  return (
    <Routes>
      {allRoutes.map(({ path, element, children }) => (
        <Route key={path} path={path} element={element}>
          {children &&
            children.map((childRoute, index) => (
              <Route
                key={index}
                path={childRoute.path}
                element={childRoute.element}
              />
            ))}
        </Route>
      ))}
    </Routes>
  );
};

export default RenderRoutes;
