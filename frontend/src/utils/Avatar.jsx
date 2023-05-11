import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

import DoctorAvartar from '../assets/DoctorAvatar.jpeg';
import DoctorAvatar1 from '../assets/DoctorAvatar1.jpg';
import DoctorAvatar2 from '../assets/DoctorAvatar2.jpg';
import DoctorAvatar3 from '../assets/DoctorAvatar3.jpg';
import DoctorAvatar4 from '../assets/DoctorAvatar4.jpg';
import DoctorAvatar5 from '../assets/DoctorAvatar5.jpg';

const avatars = [
  {
    'name': 'DoctorAvatar1',
    'src': DoctorAvatar1
  },
  {
    'name': 'DoctorAvatar2',
    'src': DoctorAvatar2
  },
  {
    'name': 'DoctorAvatar3',
    'src': DoctorAvatar3
  },
  {
    'name': 'DoctorAvatar4',
    'src': DoctorAvatar4
  },
  {
    'name': 'DoctorAvatar5',
    'src': DoctorAvatar5
  },
  {
    'name': 'DoctorAvatar6',
    'src': DoctorAvatar1
  }
];

export default function ImageAvatars({ id, size }) {

  for (let i = 0; i < avatars.length; i++) {
    if (id == avatars[i].name && size == 'big') {
      return (
        <Stack direction="row" spacing={2}>
          <Avatar
            alt='`${avatars[i].name}`'
            src={avatars[i].src}
            sx={{ width: 120, height: 120, mx: 'auto' }}
          />
        </Stack>
      )
    } else if (id == avatars[i].name) {
      return (
        <Stack direction="row" spacing={2}>
          <Avatar
            alt='`${avatars[i].name}`'
            src={avatars[i].src}
            sx={{ mr: 1 }} />
        </Stack>
      )
    }
  }
  return (
    <Stack direction="row" spacing={2}>
      <Avatar
        alt='`default avatar`'
        src={DoctorAvartar}
        sx={{ mr: 1 }} />
    </Stack>
  )

}