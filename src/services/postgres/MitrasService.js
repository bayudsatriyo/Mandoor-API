const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
// const AuthenticationError = require('../../exceptions/AuthenticationError');

class MitrasService {
  constructor() {
    this._pool = new Pool();
  }

  async verifyNewMitraname(mitraname) {
    const query = {
      text: 'SELECT mitraname FROM mitras WHERE mitraname = $1',
      values: [mitraname],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.');
    }
  }

  async verifyNewEmail(email) {
    const query = {
      text: 'SELECT email FROM mitras WHERE email = $1',
      values: [email],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError('Gagal menambahkan mitra. email sudah digunakan.');
    }
  }

  async verifyNewEmailUserInMitra(email) {
    const query = {
      text: 'SELECT email FROM users WHERE email = $1',
      values: [email],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError('Gagal menambahkan mitra. email sudah digunakan sebagai user.');
    }
  }

  async verifyNewNoKTP(noKTP) {
    const query = {
      text: 'SELECT noKTP FROM mitras WHERE noKTP = $1',
      values: [noKTP],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError('Gagal menambahkan mitra. KTP sudah digunakan.');
    }
  }

  async addMitra({
    email, mitraname, fullname, password, noKTP, nomorwa, alamat,
  }) {
    // TODO: Verifikasi email, pastikan belum terdaftar sebagai mitra.
    await this.verifyNewEmail(email);
    // TODO: Verifikasi email, pastikan belum terdaftar sebagai user.
    await this.verifyNewEmailUserInMitra(email);
    // TODO: Verifikasi mitraname, pastikan belum terdaftar.
    await this.verifyNewMitraname(mitraname);
    // TODO: Verifikasi NoKTP, pastikan belum terdaftar.
    await this.verifyNewNoKTP(noKTP);
    // TODO: Bila verifikasi lolos, maka masukkan mitra baru ke database.
    const id = `mitra-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: 'INSERT INTO mitras VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      values: [id, email, mitraname, fullname, hashedPassword, noKTP, nomorwa, alamat],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Mitra gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getMitraByEmail(email) {
    const query = {
      text: 'SELECT * FROM mitras WHERE email = $1',
      values: [email],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Mitra tidak ditemukan');
    }

    return result.rows[0];
  }

  async getMitraByMitraname(mitraname) {
    const query = {
      text: 'SELECT * FROM mitras WHERE mitraname LIKE $1',
      values: [`%${mitraname}%`],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Mitra tidak ditemukan');
    }
    return result.rows;
  }
}

module.exports = MitrasService;
