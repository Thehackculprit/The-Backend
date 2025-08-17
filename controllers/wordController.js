const { Document, Packer, Paragraph, TextRun } = require("docx");
const InternDetails = require('../model/InternFullDetails');
const ExcelJS = require('exceljs');
const adminAuth = require("../middleware/auth");

const generateAllApplicationsExcel = async (req, res) => {
    try {
        // 1. Fetch all application data from the database
        const allData = await InternDetails.find().lean(); // .lean() gives plain JS objects

        if (!allData.length) {
            return res.status(404).json({ error: "No applications found" });
        }

        // 2. Create a new Excel workbook and a worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Applications');

        // 3. Define the columns for the Excel sheet
        // We can dynamically create headers from the keys of the first application object
        const headers = Object.keys(allData[0]);
        worksheet.columns = headers.map(key => ({
            header: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize header
            key: key,
            width: 20 // Set a default column width
        }));

        // Adjust column width for specific fields if needed
        worksheet.getColumn('introduction').width = 50;
        worksheet.getColumn('address').width = 40;


        // 4. Add the data rows to the worksheet
        worksheet.addRows(allData);

        // Style the header row
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE0E0E0' } // Light grey background
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });


        // 5. Set the response headers for an Excel file download
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "All_Applications.xlsx"
        );

        // 6. Write the workbook buffer to the response
        const buffer = await workbook.xlsx.writeBuffer();
        res.send(buffer);

    } catch (error) {
        console.error("Failed to generate Excel sheet:", error);
        res.status(500).json({ error: "Failed to generate Excel sheet for all applications" });
    }
};

module.exports = { generateAllApplicationsExcel };
