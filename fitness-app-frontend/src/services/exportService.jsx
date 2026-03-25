import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { pdf } from '@react-pdf/renderer';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { formatDisplayDate } from '../utils/formatters';

export const exportActivitiesCSV = (activities) => {
  const data = activities.map((a) => ({
    type: a.type,
    duration: a.duration,
    caloriesBurned: a.caloriesBurned,
    date: a.startTime ? formatDisplayDate(a.startTime) : formatDisplayDate(a.createdAt),
    ...(a.additionalMetrics && typeof a.additionalMetrics === 'object' ? a.additionalMetrics : {}),
  }));
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `fitness-activities-${Date.now()}.csv`);
};

const pdfStyles = StyleSheet.create({
  page: {
    padding: 36,
    backgroundColor: '#0a0a0f',
    color: '#f1f5f9',
    fontSize: 10,
  },
  title: { fontSize: 20, color: '#a855f7', marginBottom: 8 },
  subtitle: { fontSize: 11, color: '#94a3b8', marginBottom: 16 },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(124,58,237,0.25)',
    paddingVertical: 6,
  },
  cell: { flex: 1, color: '#e2e8f0' },
  header: { fontWeight: 'bold', color: '#7c3aed' },
});

function FitnessReportDoc({ userName, activities, recommendations, stats }) {
  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <Text style={pdfStyles.title}>Fitness report</Text>
        <Text style={pdfStyles.subtitle}>
          {userName} · Generated {formatDisplayDate(new Date().toISOString())}
        </Text>
        {stats && (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: '#06b6d4' }}>
              Activities: {stats.totalActivities} · Calories: {stats.totalCaloriesBurned} · Minutes:{' '}
              {stats.totalDurationMinutes}
            </Text>
          </View>
        )}
        <View style={pdfStyles.row}>
          <Text style={[pdfStyles.cell, pdfStyles.header]}>Type</Text>
          <Text style={[pdfStyles.cell, pdfStyles.header]}>Duration</Text>
          <Text style={[pdfStyles.cell, pdfStyles.header]}>Calories</Text>
          <Text style={[pdfStyles.cell, pdfStyles.header]}>Date</Text>
        </View>
        {(activities || []).slice(0, 40).map((a) => (
          <View key={a.id} style={pdfStyles.row} wrap={false}>
            <Text style={pdfStyles.cell}>{a.type}</Text>
            <Text style={pdfStyles.cell}>{a.duration ?? '—'}</Text>
            <Text style={pdfStyles.cell}>{a.caloriesBurned ?? '—'}</Text>
            <Text style={pdfStyles.cell}>
              {a.startTime ? formatDisplayDate(a.startTime) : formatDisplayDate(a.createdAt)}
            </Text>
          </View>
        ))}
        <Text style={{ marginTop: 20, color: '#a855f7', fontSize: 12 }}>Recommendation notes</Text>
        {(recommendations || []).slice(0, 8).map((r) => (
          <Text key={r.id} style={{ marginTop: 6, color: '#cbd5e1' }}>
            {(r.analysisText || '').slice(0, 200)}
            {(r.analysisText || '').length > 200 ? '…' : ''}
          </Text>
        ))}
      </Page>
    </Document>
  );
}

export async function exportFitnessPdf({ userName, activities, recommendations, stats }) {
  const blob = await pdf(
    <FitnessReportDoc
      userName={userName || 'User'}
      activities={activities}
      recommendations={recommendations}
      stats={stats}
    />,
  ).toBlob();
  saveAs(blob, `fitness-report-${Date.now()}.pdf`);
}
