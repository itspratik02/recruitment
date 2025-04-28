package com.example.Employee_recruitment_system.service;

import com.example.Employee_recruitment_system.model.Assessment;
import com.example.Employee_recruitment_system.model.HiringTeam;
import com.example.Employee_recruitment_system.model.JobPost;
import com.example.Employee_recruitment_system.model.Questions;
import com.example.Employee_recruitment_system.repository.AssessmentRepository;
import com.example.Employee_recruitment_system.repository.HiringTeamRepository;
import com.example.Employee_recruitment_system.repository.JobPostRepository;
import com.example.Employee_recruitment_system.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Iterator;import org.apache.poi.ss.usermodel.*;

@Service
@RequiredArgsConstructor
public class AssessmentUploadService {

    @Autowired
    private final AssessmentRepository assessmentRepository;

    @Autowired
    private final QuestionRepository questionRepository;

    @Autowired
    private final JobPostRepository jobPostRepository;


    public void processExcelFile(MultipartFile file, Long jobPostId, int duration, int totalMarks, int passingMarks,int noOfQuestions, String instructions) {
        try (XSSFWorkbook workbook = new XSSFWorkbook(file.getInputStream())) {
            XSSFSheet sheet = workbook.getSheetAt(0);

            // Fetch related entities
            JobPost jobPost = jobPostRepository.findById(jobPostId)
                    .orElseThrow(() -> new RuntimeException("Job post not found"));

            // Save Assessment
            Assessment assessment = new Assessment();
            assessment.setDuration(duration);
            assessment.setTotalMarks(totalMarks);
            assessment.setPassingMarks(passingMarks);
            assessment.setInstructions(instructions);
            assessment.setNoOfQuestions(noOfQuestions);
            assessment.setJd(jobPost);

            assessmentRepository.save(assessment);

            // Start from row 1 (skip header)
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                Questions question = new Questions();
                question.setAssessment(assessment);
                
                // Using getCellValue helper method for all cell readings
                question.setQuestionText(getCellValue(row.getCell(0))); // Question Text
                question.setOptionA(getCellValue(row.getCell(1)));      // Option A
                question.setOptionB(getCellValue(row.getCell(2)));      // Option B
                question.setOptionC(getCellValue(row.getCell(3)));      // Option C
                question.setOptionD(getCellValue(row.getCell(4)));      // Option D
                question.setOptionE(getCellValue(row.getCell(5)));      // Option E
                question.setOptionF(getCellValue(row.getCell(6)));      // Option F
                question.setCorrectOption(getCellValue(row.getCell(7))); // Correct Option
                
                // Handle marks as numeric value
                Cell marksCell = row.getCell(8);
                if (marksCell != null) {
                    if (marksCell.getCellType() == CellType.NUMERIC) {
                        question.setMarks((int) marksCell.getNumericCellValue());
                    } else {
                        // Try to parse string value as number if not numeric
                        try {
                            question.setMarks(Integer.parseInt(marksCell.getStringCellValue().trim()));
                        } catch (Exception e) {
                            throw new RuntimeException("Invalid marks value in row " + (i + 1));
                        }
                    }
                }

                questionRepository.save(question);
            }

        } catch (IOException e) {
            throw new RuntimeException("Failed to read Excel file", e);
        }
    }

    private String getCellValue(Cell cell) {
        if (cell == null) {
            return "";
        }
        
        switch (cell.getCellType()) {
            case NUMERIC:
                // Handle numeric values
                double numericValue = cell.getNumericCellValue();
                // Check if it's a whole number
                if (numericValue == Math.floor(numericValue)) {
                    return String.format("%.0f", numericValue);
                }
                return String.valueOf(numericValue);
            case STRING:
                return cell.getStringCellValue();
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                try {
                    return String.valueOf(cell.getNumericCellValue());
                } catch (Exception e) {
                    return cell.getStringCellValue();
                }
            case BLANK:
                return "";
            default:
                return "";
        }
    }

}
