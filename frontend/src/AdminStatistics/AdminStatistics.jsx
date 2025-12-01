import "../output.css";
import { logout } from "../Api/logout";
import ImgAdminUser01Component from "../pageAdminUser/componentAdminUser/ImgAdminUser01";
import LinkGoPage from "../pageAdminUser/componentAdminUser/LinkGoPage";
import Button from "../pageAdminUser/componentAdminUser/Button";
import MonthlySalesChart from "./componentAdminStatistics/MonthlySalesChart";
import SoldUnsoldTicketsChart from "./componentAdminStatistics/SoldUnsoldTicketsChart";
import Top5TicketSalesChart from "./componentAdminStatistics/Top5TicketSalesChart";
import RevenueMonthChart from "./componentAdminStatistics/RevenueMonthChart";
export default function AdminStatistics() {
  return (
    <>
      <div className="bg-linear-[var(--colorBg)] flex h-screen">
        {/* Sidebar - cố định */}
        <div className="flex flex-col shadow-3xl w-[20%] h-full items-center justify-center bg-white">
          <ImgAdminUser01Component />
          <LinkGoPage />
          <Button text={"Log Out"} onClick={logout} />
        </div>

        {/* Main Content - chiếm 78% */}
        <div className="flex flex-col w-[78%] p-4">
          <div className="flex flex-col bg-white h-full rounded-3xl shadow-lg overflow-y-auto overflow-x-hidden">
            <div className="flex items-center justify-center p-10 gap-10">
              <MonthlySalesChart />
              <SoldUnsoldTicketsChart />
            </div>
            <div className="p-10">
              <Top5TicketSalesChart />
            </div>
            <div className="p-10">
              {" "}
              <RevenueMonthChart />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
