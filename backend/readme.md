# Dokumentasi API

## User API

Base URL: `/users`

| Method | Endpoint     | Auth       | Deskripsi                        | Request Body / Params                         |
|--------|--------------|------------|---------------------------------|-----------------------------------------------|
| GET    | `/me`        | Required   | Ambil data user yang sedang login| -                                             |
| GET    | `/`          | Required   | Ambil semua user                | -                                             |
| GET    | `/:id`       | Required   | Ambil user berdasarkan ID       | URL param: `id` (User ID)                      |
| PUT    | `/:id`       | Required   | Update user berdasarkan ID      | URL param: `id`, body: data user               |
| DELETE | `/:id`       | Required   | Hapus user berdasarkan ID       | URL param: `id`                                |
| POST   | `/register`  | Tidak      | Registrasi user baru             | Body: `{ username, email, password, ... }`    |
| POST   | `/login`     | Tidak      | Login user                      | Body: `{ email, password }`                     |
| POST   | `/logout`    | Required   | Logout user                    | -                                             |
| PUT    | `/changepw`  | Required   | Ganti password user             | Body: `{ oldPassword, newPassword }`           |

---

## Layanan API

Base URL: `/layanan`

> Catatan: Endpoint `POST`, `PUT`, dan `DELETE` hanya bisa diakses oleh admin. Upload gambar menggunakan key form-data `gambar`.

| Method | Endpoint     | Auth       | Role   | Deskripsi                      | Request Body / Params                        |
|--------|--------------|------------|--------|-------------------------------|----------------------------------------------|
| GET    | `/`          | Required   | Semua  | Ambil semua layanan            | -                                            |
| GET    | `/:id`       | Required   | Semua  | Ambil layanan berdasarkan ID  | URL param: `id`                              |
| POST   | `/`          | Required   | Admin  | Buat layanan baru             | Form-data: file `gambar`, data lain          |
| PUT    | `/:id`       | Required   | Admin  | Update layanan berdasarkan ID | URL param: `id`, form-data: file `gambar` opsional, data lain |
| DELETE | `/:id`       | Required   | Admin  | Hapus layanan berdasarkan ID  | URL param: `id`                              |

---

## Antrian API

Base URL: `/antrian`

> Catatan: Endpoint `PUT` dan `DELETE` hanya dapat diakses oleh admin.

| Method | Endpoint    | Auth       | Role   | Deskripsi                      | Request Body / Params                     |
|--------|-------------|------------|--------|-------------------------------|-------------------------------------------|
| GET    | `/riwayat`  | Required   | User   | Ambil riwayat antrian user    | -                                         |
| GET    | `/`         | Required   | Semua  | Ambil semua antrian           | -                                         |
| GET    | `/:id`      | Required   | Semua  | Ambil antrian berdasarkan ID  | URL param: `id`                           |
| POST   | `/`         | Required   | User   | Buat antrian baru             | Body: data antrian                        |
| PUT    | `/:id`      | Required   | Admin  | Update antrian berdasarkan ID | URL param: `id`, body: data update       |
| DELETE | `/:id`      | Required   | Admin  | Hapus antrian berdasarkan ID | URL param: `id`                           |

---

## Middleware dan Auth

- Semua endpoint kecuali `/register` dan `/login` membutuhkan autentikasi dengan token (JWT).
- Beberapa endpoint (seperti `POST`, `PUT`, `DELETE` pada layanan dan antrian) hanya bisa diakses oleh user dengan role **admin**.
- Upload gambar pada layanan menggunakan middleware `uploadImage.single("gambar")` yang menerima file dengan key `gambar`.

---

Kalau kamu mau aku bantu buatkan contoh request dengan `curl` atau Postman Collection juga, tinggal bilang ya!
