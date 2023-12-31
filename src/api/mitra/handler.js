const ClientError = require('../../exceptions/ClientError');

class MitrasHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postMitraHandler = this.postMitraHandler.bind(this);
    this.getMitraByEmailHandler = this.getMitraByEmailHandler.bind(this);
    this.getMitraByMitranameHandler = this.getMitraByMitranameHandler.bind(this);
  }

  async postMitraHandler(request, h) {
    try {
      this._validator.validateMitraPayload(request.payload);
      const {
        email, mitraname, fullname, password, noKTP, nomorwa, alamat,
      } = request.payload;

      const mitraId = await this._service.addMitra({
        email, mitraname, fullname, password, noKTP, nomorwa, alamat,
      });
      console.log(mitraId);

      const response = h.response({
        status: 'success',
        message: 'Mitra berhasil ditambahkan',
        data: {
          mitraId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getMitraByEmailHandler(request, h) {
    try {
      const { email } = request.params;

      const mitra = await this._service.getMitraByEmail(email);

      return {
        status: 'success',
        data: {
          mitra,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getMitraByMitranameHandler(request, h) {
    try {
      const { mitraname } = request.params;

      const mitra = await this._service.getMitraByMitraname(mitraname);
      return {
        status: 'success',
        data: {
          mitra,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = MitrasHandler;
