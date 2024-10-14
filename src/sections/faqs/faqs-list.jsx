// @mui
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Button from '@mui/material/Button';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function FaqsList() {
  const detailsBgColor = '#2D3E50';

  return (
    <>
      {/* Pertanyaan 1 */}
      <Accordion>
        <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
          <Typography variant="subtitle1">Apa itu file sharing?</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ backgroundColor: detailsBgColor, color: 'white' }}>
          <Typography>
            File sharing adalah platform yang memungkinkan pengguna berbagi dan mentransfer file
            antar perangkat atau pengguna melalui jaringan. Dengan aplikasi ini, file seperti
            dokumen, gambar, dan video dapat diakses dan dibagikan dengan mudah, mendukung
            kolaborasi jarak jauh
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Pertanyaan 2 */}
      <Accordion>
        <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
          <Typography variant="subtitle1">Maksimal kedalaman folder?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Sistem kami membatasi kedalaman folder hingga 5 level untuk memastikan performa dan
            aksesibilitas tetap optimal.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Pertanyaan 3 - Download PDF */}
      <Accordion>
        <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
          <Typography variant="subtitle1">Apa bisa share file dan folder?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Ya, Anda bisa berbagi file dengan siapa saja. Lihat panduan lengkap di bawah ini.
          </Typography>
          <Button variant="outlined" href="/files/sharing-guide.pdf" target="_blank" sx={{ mt: 2 }}>
            Lihat PDF
          </Button>
        </AccordionDetails>
      </Accordion>

      {/* Pertanyaan 4 - View PDF */}
      <Accordion>
        <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
          <Typography variant="subtitle1">Apakah ada panduan penggunaan?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Anda bisa melihat panduan lengkap penggunaan di bawah ini.</Typography>
          <Button variant="outlined" href="/files/user-guide.pdf" target="_blank" sx={{ mt: 2 }}>
            Lihat PDF
          </Button>
        </AccordionDetails>
      </Accordion>

      {/* Pertanyaan 5 */}
      <Accordion>
        <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
          <Typography variant="subtitle1">Bagaimana cara menggunakan fitur premium?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Untuk menggunakan fitur premium, silakan download panduan berikut.
          </Typography>
          <Button variant="contained" href="/files/premium-guide.pdf" download sx={{ mt: 2 }}>
            Download PDF
          </Button>
        </AccordionDetails>
      </Accordion>
    </>
  );
}
