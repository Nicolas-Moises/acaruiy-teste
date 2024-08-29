<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class UsersCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'data' => UserResource::collection($this->collection),
            // 'pagination' => [
            //     'total' => $this->total(),
            //     'per_page' => $this->perPage(),
            //     'current_page' => $this->currentPage(),
            //     'last_page' => $this->lastPage(),
            //     'from' => $this->firstItem(),
            //     'to' => $this->lastItem(),
            // ],
            // 'links' => [
            //     'first' => $this->url($this->currentPage()),
            //     'last' => $this->url($this->lastPage()),
            //     'prev' => $this->currentPage() > 1 ? $this->url($this->currentPage() - 1) : null,
            //     'next' => $this->currentPage() < $this->lastPage() ? $this->url($this->currentPage() + 1) : null,
            // ],
        ];
    }
}
