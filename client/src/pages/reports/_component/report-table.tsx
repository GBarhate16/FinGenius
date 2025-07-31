import { DataTable } from "@/components/data-table";
import { reportColumns } from "./column";
import { useState } from "react";
import { useGetAllReportsQuery } from "@/features/report/reportAPI";
import { EmptyState } from "@/components/empty-state";
import { FileText } from "lucide-react";

const ReportTable = () => {
  const [filter, setFilter] = useState({
    pageNumber: 1,
    pageSize: 10,
  });

  const { data, isFetching } = useGetAllReportsQuery(filter);

  const pagination = {
    totalItems: data?.pagination?.totalCount || 0,
    totalPages: data?.pagination?.totalPages || 0,
    pageNumber: filter.pageNumber,
    pageSize: filter.pageSize,
  };

  const handlePageChange = (pageNumber: number) => {
    setFilter((prev) => ({ ...prev, pageNumber }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setFilter((prev) => ({ ...prev, pageSize }));
  };

  // Show empty state if no reports
  if (!isFetching && (!data?.reports || data.reports.length === 0)) {
    return (
      <EmptyState
        icon={FileText}
        title="No Reports Yet"
        description="Your monthly financial reports will appear here once they are generated. Reports are automatically created and emailed to you monthly."
      />
    );
  }

  return (
    <DataTable
      data={data?.reports || []}
      columns={reportColumns}
      isLoading={isFetching}
      showSearch={false}
      className="[&_td]:!w-[5%]"
      pagination={pagination}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
    />
  );
};

export default ReportTable;
