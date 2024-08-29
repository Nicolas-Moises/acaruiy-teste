<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddressUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'street' => 'string|max:255',
            'city' => 'string|max:255',
            'state' => 'string|max:2',
            'zipcode' => 'string|max:10',
            'number' => 'string',
            'complement' => 'string|nullable',
            'district' => 'string',
            'main_address' => 'boolean'
        ];
    }
}
