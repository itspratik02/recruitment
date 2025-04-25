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

    @Autowired

    private  final HiringTeamRepository hiringTeamRepository;


    public void processExcelFile(MultipartFile file, Long jobPostId, String hiringTeamEmail) {
        try (XSSFWorkbook workbook = new XSSFWorkbook(file.getInputStream())) {
            XSSFSheet sheet = workbook.getSheetAt(0);

            // Fetch related entities
            JobPost jobPost = jobPostRepository.findById(jobPostId)
                    .orElseThrow(() -> new RuntimeException("Job post not found"));

            HiringTeam hiringTeam = hiringTeamRepository.findByEmail(hiringTeamEmail)
                    .orElseThrow(() -> new RuntimeException("Hiring team not found"));

            // Read assessment metadata (first row assumed)
            Row headerRow = sheet.getRow(0);
            int duration = (int) headerRow.getCell(0).getNumericCellValue();
            int totalMarks = (int) headerRow.getCell(1).getNumericCellValue();
            int passingMarks = (int) headerRow.getCell(2).getNumericCellValue();
            String instructions = headerRow.getCell(3).getStringCellValue();

            // Save Assessment
            Assessment assessment = new Assessment();
            assessment.setDuration(duration);
            assessment.setTotalMarks(totalMarks);
            assessment.setPassingMarks(passingMarks);
            assessment.setInstructions(instructions);
            assessment.setJd(jobPost);
            assessment.setHiringTeam(hiringTeam);

            assessmentRepository.save(assessment);

            // Save Questions (start from second row)
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                Questions question = new Questions();
                question.setAssessment(assessment);
                question.setQuestionText(row.getCell(0).getStringCellValue());
                question.setOptionA(row.getCell(1).getStringCellValue());
                question.setOptionB(row.getCell(2).getStringCellValue());
                question.setOptionC(row.getCell(3).getStringCellValue());
                question.setOptionD(row.getCell(4).getStringCellValue());
                question.setOptionE(row.getCell(5).getStringCellValue());
                question.setOptionF(row.getCell(6).getStringCellValue());
                question.setCorrectOption(row.getCell(7).getStringCellValue());
                question.setMarks((int) row.getCell(8).getNumericCellValue());

                questionRepository.save(question);
            }

        } catch (IOException e) {
            throw new RuntimeException("Failed to read Excel file", e);
        }
    }
}
