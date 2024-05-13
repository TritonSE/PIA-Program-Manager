// React PDF Documentation: https://react-pdf.org/
import {
  Document,
  Font,
  Line,
  PDFDownloadLink,
  Page,
  StyleSheet,
  Svg,
  Text,
  View,
} from "@react-pdf/renderer";

import { Button } from "../Button";

import { dateOptions } from "./NotesSelectionList";
import { ProgressNote } from "./types";

type DownloadNotesPDFProps = {
  allProgressNotes: Record<string, ProgressNote>;
  studentId: string;
  studentName: string;
  downloadStartDate: string;
  downloadEndDate: string;
  downloadDisabled: boolean;
};

type NotesDocProps = Omit<DownloadNotesPDFProps, "downloadDisabled">;

Font.register({
  family: "Poppins",
  src: "https://fonts.gstatic.com/s/poppins/v1/TDTjCH39JjVycIF24TlO-Q.ttf",
});
Font.registerEmojiSource({
  format: "png",
  url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/",
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "white",
    paddingHorizontal: 30,
    paddingVertical: 20,
    fontSize: 12,
    fontFamily: "Poppins",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  horizontalLineTitle: {
    marginBottom: 15,
    marginLeft: -30,
  },
  horizontalLine: {
    marginVertical: 15,
    marginLeft: -30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  dateText: {
    color: "#929292",
    display: "flex",
    justifyContent: "space-between",
    paddingBottom: 5,
  },
});

const NotesDoc = ({
  allProgressNotes,
  studentId,
  studentName,
  downloadStartDate,
  downloadEndDate,
}: NotesDocProps) => {
  const title = `Progress Notes for ${studentName}`;
  return (
    <Document title={title}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{title}</Text>
        <Svg style={styles.horizontalLineTitle} height="10" width="595">
          <Line x1="0" y1="5" x2="595" y2="5" strokeWidth={1} stroke="rgb(199, 199, 199)" />
        </Svg>
        {Object.values(allProgressNotes)
          .filter((note) => {
            return (
              note.studentId === studentId &&
              new Date(note.dateLastUpdated).setHours(0, 0, 0, 0) >=
                new Date(downloadStartDate).setHours(0, 0, 0, 0) &&
              new Date(note.dateLastUpdated).setHours(0, 0, 0, 0) <=
                new Date(downloadEndDate).setHours(0, 0, 0, 0)
            );
          })
          .sort(
            (a, b) => new Date(b.dateLastUpdated).getTime() - new Date(a.dateLastUpdated).getTime(),
          )
          .map((note) => (
            <View key={note._id}>
              <Text style={styles.dateText}>
                {new Date(note.dateLastUpdated).toLocaleDateString("en-US", dateOptions)}
                &nbsp;| By {note.lastEditedBy}
              </Text>
              <Text>{note.content}</Text>
              <Svg style={styles.horizontalLine} height="10" width="595">
                <Line x1="0" y1="5" x2="595" y2="5" strokeWidth={1} stroke="rgb(199, 199, 199)" />
              </Svg>
            </View>
          ))}
      </Page>
    </Document>
  );
};

const DownloadNotesPDF = ({
  allProgressNotes,
  studentId,
  studentName,
  downloadStartDate,
  downloadEndDate,
  downloadDisabled,
}: DownloadNotesPDFProps) => {
  const underlinedName = studentName.replace(" ", "_");
  return (
    <div className="basis-full cursor-not-allowed">
      <PDFDownloadLink
        className={downloadDisabled ? "pointer-events-none" : ""}
        aria-disabled={downloadDisabled}
        document={
          <NotesDoc
            allProgressNotes={allProgressNotes}
            studentId={studentId}
            studentName={studentName}
            downloadStartDate={downloadStartDate}
            downloadEndDate={downloadEndDate}
          />
        }
        fileName={`progress_notes_${underlinedName}.pdf`}
      >
        {({ blob: _blob, url: _url, loading, error }) => {
          console.log(error);
          return (
            <Button
              label="Download"
              style={{ width: "100%" }}
              disabled={downloadDisabled}
              className={
                downloadDisabled || loading
                  ? "pointer-events-none  cursor-not-allowed"
                  : "pointer-events-none "
              }
            />
          );
        }}
      </PDFDownloadLink>
    </div>
  );
};

export default DownloadNotesPDF;
