import { BadRequestException } from '@nestjs/common';
import { Workbook, Worksheet } from 'exceljs';
import { file, tmpName } from 'tmp';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import * as fs from 'fs';

export const createWordFile = async (document: Document, filename = 'BCN') => {
    let File = await new Promise((resolve, reject) => {
        file(
            {
                keep: false,
                prefix: filename,
                postfix: '.docx',
                mode: parseInt('0600', 8),
                discardDescriptor: true,
            },
            async (err, _file) => {
                if (err) throw new BadRequestException(err.message);

                Packer.toBuffer(document)
                    .then((buffer) => {
                        // console.log("_file : ", _file)
                        fs.writeFileSync(_file, buffer);
                    })
                    .then((_) => {
                        resolve(_file);
                    })
                    .catch((ex) => {
                        throw new BadRequestException(ex.message);
                    });
            },
        );
    });

    return File;
};

export const createExcelFile = async (book: Workbook) => {
    let File = await new Promise((resolve, reject) => {
        file(
            {
                keep: false,
                prefix: 'IDMS_Data_',
                postfix: '.xlsx',
                mode: parseInt('0600', 8),
                discardDescriptor: true,
            },
            async (err, _file) => {
                if (err) throw new BadRequestException(err.message);

                book.xlsx
                    .writeFile(_file)
                    .then((_) => {
                        resolve(_file);
                    })
                    .catch((ex) => {
                        throw new BadRequestException(ex.message);
                    });
            },
        );
    });

    return File;
};

// private
const styleSheet = (sheet: Worksheet) => {
    sheet.getColumn(1).width = 40;
    sheet.getColumn(2).width = 10;
    sheet.getColumn(3).width = 20;

    sheet.getRow(1).height = 24;
    sheet.getRow(1).font = { size: 13, bold: true, color: { argb: '000000' } };
    sheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        bgColor: { argb: 'f2f2f2' },
        fgColor: { argb: 'f2f2f2' },
    };
    sheet.getRow(1).alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
    };

    sheet.getRow(1).border = {
        top: { style: 'thin', color: { argb: 'aaaaaa' } },
        left: { style: 'thin', color: { argb: 'aaaaaa' } },
        bottom: { style: 'thin', color: { argb: 'aaaaaa' } },
        right: { style: 'thin', color: { argb: 'aaaaaa' } },
    };

    return sheet;
};

export const ExportExcel = async (data: any = null, fields: any = null) => {
    let ans;
    if (!fields) ans = data;

    let book = new Workbook();
    let sheet = book.addWorksheet('data');

    if (fields && data && data.length && Array.isArray(fields)) {
        ans = data.map((entity, index) => {
            let res: any = {};

            if (!entity) return null;
            for (let i = 0; i < fields?.length; i++)
                res[fields[i].dst] = entity[fields[i].src];

            return res;
        });
    }

    let rows = [];
    if (ans) {
        ans.forEach((doc) => {
            rows.push(Object.values(doc));
        });

        rows.unshift(Object.keys(ans[0]));
    } else {
        let array_fields = [];
        if (fields && fields.length)
            for (let i = 0; i < fields.length; i++)
                array_fields.push(fields[i].dst);

        rows.push(array_fields);
    }

    sheet.addRows(rows);
    for (let index = 0; index < fields.length; index++) {
        try {
            sheet.getColumn(index).width = 20;
        } catch {}
    }

    sheet = styleSheet(sheet);
    let file = await createExcelFile(book);

    return file;
};

export const ImportExcel = async (file: any, fields: any = []) => {
    const getCellValue = (sheet: Worksheet, x: number, y: number) => {
        const cellValue = sheet.getRow(x).getCell(y).value;
        return cellValue;
    };

    let workBook = new Workbook();
    await workBook.xlsx.load(file.buffer);

    const sheet = workBook.getWorksheet(1);

    let ans = [];
    for (let index = 2; index <= sheet.actualRowCount; index++) {
        let entity = {};

        for (let indexC = 1; indexC <= sheet.actualColumnCount; indexC++) {
            let value = getCellValue(sheet, index, indexC);
            if (!value) value = '';

            if (fields && fields[indexC - 1] && fields[indexC - 1].src) {
                const field = fields[indexC - 1]?.src;
                entity[field] = value;
            } else {
                let field = getCellValue(sheet, 1, indexC).toString();
                if (!field || field === '') continue;
                entity[field] = value;
            }
        }

        ans.push(entity);
    }

    return ans;
};
