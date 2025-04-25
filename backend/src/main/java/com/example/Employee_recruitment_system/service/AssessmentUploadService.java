package com.example.Employee_recruitment_system.service;

import com.example.Employee_recruitment_system.model.Assessment;
import com.example.Employee_recruitment_system.model.JobPost;
import com.example.Employee_recruitment_system.model.Questions;
import com.example.Employee_recruitment_system.repository.AssessmentRepository;
import com.example.Employee_recruitment_system.repository.JobPostRepository;
import com.example.Employee_recruitment_system.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Iterator;

@Service
@RequiredArgsConstructor
public class AssessmentUploadService {

    @Autowired
    private final AssessmentRepository assessmentRepository;

    @Autowired
    private final QuestionRepository questionRepository;

    @Autowired
    private final JobPostRepository jobPostRepository;

    public void uploadAssessmentData(MultipartFile file, Long jobPostId) throws IOException {
        // Check if file is empty
        if (file.isEmpty()) {
            throw new RuntimeException("Uploaded file is empty.");
        }

        // Retrieve the job post
        JobPost jobPost = jobPostRepository.findById(jobPostId)
                .orElseThrow(() -> new RuntimeException("Job post not found"));

        // Log successful retrieval of JobPost
        System.out.println("Job post found: " + jobPost.getJdid());

        // Parse the Excel file
        try (XSSFWorkbook workbook = new XSSFWorkbook(file.getInputStream())) {
            XSSFSheet sheet = workbook.getSheetAt(0);

            // Process the rows in the sheet
            Iterator<Row> rows = sheet.iterator();
            if (rows.hasNext()) {
                rows.next();  // Skip header row
            }

            // Process the first row after the header to create the assessment
            if (rows.hasNext()) {
                Row headerRow = rows.next();
                XSSFRow xssfHeaderRow = (XSSFRow) headerRow;

                // Log data extracted from the first row
                System.out.println("Processing row: " + xssfHeaderRow);

                // Fetch values with safety checks
                String instructions = getCellStringValue(xssfHeaderRow.getCell(3));
                int duration = (int) getCellNumericValue(xssfHeaderRow.getCell(0));
                int totalMarks = (int) getCellNumericValue(xssfHeaderRow.getCell(1));
                int passingMarks = (int) getCellNumericValue(xssfHeaderRow.getCell(2));

                // Create and save the assessment for the given job post
                Assessment assessment = new Assessment();
                assessment.setDuration(duration);
                assessment.setTotalMarks(totalMarks);
                assessment.setPassingMarks(passingMarks);
                assessment.setInstructions(instructions);
                assessment.setJd(jobPost);
                assessmentRepository.save(assessment);

                // Log successful save of assessment
                System.out.println("Assessment saved with ID: " + assessment.getAssessmentID());  // Update to use assessmentID

                // Process questions in the file
                while (rows.hasNext()) {
                    Row row = rows.next();
                    XSSFRow xssfRow = (XSSFRow) row;

                    // Log question data being processed
                    System.out.println("Processing question row: " + xssfRow);

                    // Fetch question data safely
                    String questionText = getCellStringValue(xssfRow.getCell(4));
                    String optionA = getCellStringValue(xssfRow.getCell(5));
                    String optionB = getCellStringValue(xssfRow.getCell(6));
                    String optionC = getCellStringValue(xssfRow.getCell(7));
                    String optionD = getCellStringValue(xssfRow.getCell(8));
                    String optionE = getCellStringValue(xssfRow.getCell(9));
                    String optionF = getCellStringValue(xssfRow.getCell(10));
                    String correctOption = getCellStringValue(xssfRow.getCell(11));
                    int marks = (int) getCellNumericValue(xssfRow.getCell(12));

                    // Create and save question
                    Questions question = new Questions();
                    question.setAssessment(assessment);
                    question.setQuestionText(questionText);
                    question.setOptionA(optionA);
                    question.setOptionB(optionB);
                    question.setOptionC(optionC);
                    question.setOptionD(optionD);
                    question.setOptionE(optionE);
                    question.setOptionF(optionF);
                    question.setCorrectOption(correctOption);
                    question.setMarks(marks);

                    questionRepository.save(question);

                    // Log successful save of question
                    System.out.println("Question saved with ID: " + question.getQuestionID());  // Update to use questionID
                }
            }
        } catch (IOException e) {
            // Log error reading file
            System.err.println("Error reading file: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to upload assessment due to file reading error.", e);
        } catch (Exception e) {
            // Log any other errors
            System.err.println("Error during processing: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to upload assessment due to unexpected error.", e);
        }
    }

    // Utility methods for safe cell value extraction
    private String getCellStringValue(XSSFCell cell) {
        return (cell != null && cell.getCellType() == CellType.STRING) ? cell.getStringCellValue() : "";
    }

    private double getCellNumericValue(XSSFCell cell) {
        return (cell != null && cell.getCellType() == CellType.NUMERIC) ? cell.getNumericCellValue() : 0;
    }
}
