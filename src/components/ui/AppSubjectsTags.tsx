import { Chip }  from '@mui/material'

type SubjectsTags = {
    label: string;
    color: string;
};

export function SubjectChip({ label, color }: SubjectsTags) {
    return (
    <Chip
      label={label}
      variant="outlined"
      sx={{
        borderRadius: "20px",
        borderColor: `${color}60`,
        color: color,
        backgroundColor: `${color}20`,
        fontWeight: 500,
        paddingX: 1,
      }}
    />
  );
}

export const SUBJECTS = {
  ciencias: {
    label: "Ciências",
    color: "#00D2ED",
  },
  matematica: {
    label: "Matemática",
    color: "#AD44F8",
  },
   portugues: {
    label: "Portugês",
    color: "#0571F7",
  },
  historia: {
    label: "História",
    color: "#FFBA00",
  },
   geografia: {
    label: "Geografia",
    color: "#00D46A",
  },
     ingles: {
    label: "Inglês",
    color: "#FE33A3",
  },
};

export default function AppSubjectsChip() {
  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <SubjectChip {...SUBJECTS.ciencias} />
      <SubjectChip {...SUBJECTS.matematica} />
    </div>
  );
}