package com.aihealthos.dto;

public class DashboardStatsResponse {

    private long totalPatients;
    private long activeEmergencies;
    private long unreviewedHighRiskDiagnoses;
    private long unreviewedAbnormalReports;

    public DashboardStatsResponse() {
    }

    public DashboardStatsResponse(long totalPatients, long activeEmergencies, long unreviewedHighRiskDiagnoses, long unreviewedAbnormalReports) {
        this.totalPatients = totalPatients;
        this.activeEmergencies = activeEmergencies;
        this.unreviewedHighRiskDiagnoses = unreviewedHighRiskDiagnoses;
        this.unreviewedAbnormalReports = unreviewedAbnormalReports;
    }

    public long getTotalPatients() {
        return totalPatients;
    }

    public void setTotalPatients(long totalPatients) {
        this.totalPatients = totalPatients;
    }

    public long getActiveEmergencies() {
        return activeEmergencies;
    }

    public void setActiveEmergencies(long activeEmergencies) {
        this.activeEmergencies = activeEmergencies;
    }

    public long getUnreviewedHighRiskDiagnoses() {
        return unreviewedHighRiskDiagnoses;
    }

    public void setUnreviewedHighRiskDiagnoses(long unreviewedHighRiskDiagnoses) {
        this.unreviewedHighRiskDiagnoses = unreviewedHighRiskDiagnoses;
    }

    public long getUnreviewedAbnormalReports() {
        return unreviewedAbnormalReports;
    }

    public void setUnreviewedAbnormalReports(long unreviewedAbnormalReports) {
        this.unreviewedAbnormalReports = unreviewedAbnormalReports;
    }

    public static DashboardStatsResponseBuilder builder() {
        return new DashboardStatsResponseBuilder();
    }

    public static class DashboardStatsResponseBuilder {
        private long totalPatients;
        private long activeEmergencies;
        private long unreviewedHighRiskDiagnoses;
        private long unreviewedAbnormalReports;

        public DashboardStatsResponseBuilder totalPatients(long totalPatients) {
            this.totalPatients = totalPatients;
            return this;
        }

        public DashboardStatsResponseBuilder activeEmergencies(long activeEmergencies) {
            this.activeEmergencies = activeEmergencies;
            return this;
        }

        public DashboardStatsResponseBuilder unreviewedHighRiskDiagnoses(long unreviewedHighRiskDiagnoses) {
            this.unreviewedHighRiskDiagnoses = unreviewedHighRiskDiagnoses;
            return this;
        }

        public DashboardStatsResponseBuilder unreviewedAbnormalReports(long unreviewedAbnormalReports) {
            this.unreviewedAbnormalReports = unreviewedAbnormalReports;
            return this;
        }

        public DashboardStatsResponse build() {
            return new DashboardStatsResponse(totalPatients, activeEmergencies, unreviewedHighRiskDiagnoses, unreviewedAbnormalReports);
        }
    }
}
