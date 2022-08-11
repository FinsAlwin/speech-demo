import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Container } from "reactstrap";

const FullLayout = () => {
  return (
    <main>
      <div className="pageWrapper d-lg-flex">
        {/********Sidebar**********/}
        {/* <aside className="sidebarArea shadow" id="sidebarArea">
          <Sidebar />
        </aside> */}
        {/********Content Area**********/}

        <div className="contentArea">
          {/********header**********/}
          <Header />
          {/********Middle Content**********/}
          <Container className="p-4 wrapper" fluid>
            <Outlet />
          </Container>
        </div>
      </div>
      <footer className="text-center text-lg-start bg-light text-muted">
        <div className="text-center p-4" style={{ backgroundColor: "#0d6efd" }}>
          <span className="text-white"> By Alwin WK</span>
        </div>
      </footer>
    </main>
  );
};

export default FullLayout;
