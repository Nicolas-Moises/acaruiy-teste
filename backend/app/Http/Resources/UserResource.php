<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $mainAddress = $this->addresses->where('main_address', true)->first();

        if ($mainAddress) {
            $address = $mainAddress->street . ", " . $mainAddress->number . " - " . $mainAddress->city . ", " . $mainAddress->state;
        } else {
            $address = null;
        }
        
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'document' => $this->document,
            'phone' => $this->phone,
            'cellphone' => $this->cellphone,
            'avatar' => (!empty($this->avatar)) ? Storage::url($this->avatar) : null,
            'main_address' => $address,
        ];
    }
}
